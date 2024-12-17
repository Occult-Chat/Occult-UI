#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{env, time::{SystemTime, UNIX_EPOCH}};
use tauri::Manager;
use workspace::{get_working_dir, CONFIG};
pub mod workspace;
pub mod commands;
#[tauri::command]
fn on_button_clicked() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();
    format!("on_button_clicked called from Rust! (timestamp: {since_the_epoch}ms)")
}
#[tauri::command]
fn minimize() {}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn main() {
    env::set_var("RUST_LOG", "debug");
    env_logger::init();
    println!("{}",get_working_dir().unwrap().display());
    let size = &CONFIG.read().window_size;

    println!("{size:#?}");
    tauri::Builder::default()
        // Add window decorations configuration
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // Hide the titlebar
            window.set_decorations(false).unwrap();
            window.set_shadow(false).unwrap();
            // window.set_fullscreen(true).unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
