use anyhow::{Ok, Result};

use crate::workspace::CONFIG;

#[tauri::command]
fn get_config() -> Result<String> {
    let config = CONFIG.read();
    let config_json = serde_json::to_string(&*config)?;
    Ok(config_json)
}
