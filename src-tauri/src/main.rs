#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use scrap::{Capturer, Display};
use std::time::{Duration, Instant};
use tauri::Manager;
use serde::Serialize;
use std::sync::Arc;
use tokio::sync::Mutex;
use std::io::ErrorKind::WouldBlock;

#[derive(Clone, Serialize)]
struct FrameData {
    width: usize,
    height: usize,
    data: Vec<u8>,
    frame_time: f32,
}

struct CaptureState {
    is_capturing: bool,
}

#[tauri::command]
async fn capture_screen(state: tauri::State<'_, Arc<Mutex<CaptureState>>>) -> Result<FrameData, String> {
    let display = Display::primary().map_err(|e| e.to_string())?;
    let mut capturer = Capturer::new(display).map_err(|e| e.to_string())?;
    
    let width = capturer.width();
    let height = capturer.height();
    let expected_len = width * height * 4;
    let start = Instant::now();
    
    // Try to get a frame, handling potential WouldBlock
    let frame = loop {
        match capturer.frame() {
            Ok(frame) => break frame,
            Err(error) => {
                if error.kind() == WouldBlock {
                    // Keep trying for a short time
                    if start.elapsed() > Duration::from_secs(1) {
                        return Err("Timeout waiting for frame".to_string());
                    }
                    std::thread::sleep(Duration::from_millis(1));
                    continue;
                }
                return Err(error.to_string());
            }
        }
    };

    // Debug info
    println!("Frame info:");
    println!("Width: {}, Height: {}", width, height);
    println!("Expected len: {}, Got len: {}", expected_len, frame.len());
    println!("Pixel stride: {}", frame.len() / (width * height));

    // Calculate actual dimensions based on received frame size
    let actual_stride = frame.len() / (width * height);
    
    // Convert frame data to RGBA
    let mut rgba_data = Vec::with_capacity(width * height * 4);
    for y in 0..height {
        for x in 0..width {
            let i = (y * width + x) * actual_stride;
            if i + 3 < frame.len() {
                rgba_data.push(frame[i + 2]); // R (from B)
                rgba_data.push(frame[i + 1]); // G
                rgba_data.push(frame[i]);     // B (from R)
                rgba_data.push(frame[i + 3]); // A
            }
        }
    }

    let frame_time = start.elapsed().as_secs_f32() * 1000.0;

    Ok(FrameData {
        width,
        height,
        data: rgba_data,
        frame_time,
    })
}

#[tauri::command]
async fn start_capture(state: tauri::State<'_, Arc<Mutex<CaptureState>>>) -> Result<(), String> {
    let mut state = state.lock().await;
    state.is_capturing = true;
    Ok(())
}

#[tauri::command]
async fn stop_capture(state: tauri::State<'_, Arc<Mutex<CaptureState>>>) -> Result<(), String> {
    let mut state = state.lock().await;
    state.is_capturing = false;
    Ok(())
}

#[tauri::command]
fn minimize() {}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn main() {
    let capture_state = Arc::new(Mutex::new(CaptureState {
        is_capturing: false,
    }));

    tauri::Builder::default()
        .manage(capture_state)
        .invoke_handler(tauri::generate_handler![
            minimize,
            capture_screen,
            start_capture,
            stop_capture
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_decorations(false).unwrap();
            window.set_shadow(false).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}