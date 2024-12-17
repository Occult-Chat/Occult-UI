use anyhow::Result;
use tauri::command;
use crate::workspace::{ClientCache, ClientConfig, CACHE, CONFIG};


#[command]
pub fn get_config() -> Result<String, String> {
    let config = CONFIG.read();
    serde_json::to_string(&*config)
        .map_err(|e| e.to_string())
}

#[command]
pub fn get_cache() -> Result<String, String> {
    let cache = CACHE.read();
    serde_json::to_string(&*cache)
        .map_err(|e| e.to_string())
}

#[command]
pub fn set_config(config_json: String) -> Result<(), String> {
    let config = serde_json::from_str(&config_json)
        .map_err(|e| e.to_string())?;
    let mut write_guard = CONFIG.write();
    *write_guard = config;
    Ok(())
}

#[command]
pub fn set_cache(cache_json: String) -> Result<(), String> {
    let cache = serde_json::from_str(&cache_json)
        .map_err(|e| e.to_string())?;
    let mut write_guard = CACHE.write();
    *write_guard = cache;
    Ok(())
}