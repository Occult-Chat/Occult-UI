use std::cell::Cell;
use std::cell::RefCell;
use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::Path;
use std::path::PathBuf;
use std::sync::RwLock;

use anyhow::anyhow;
use anyhow::Context;
use anyhow::Result;
use lazy_static::lazy_static;
use log::debug;
use log::error;
use serde::{Deserialize,Serialize};
use thiserror::Error;
#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("Invalid port number. expected value in range 1..65535 got {received}")]
    InvalidPort { received: u32 },
    #[error("Failed to parse value. Expected {expected}. Got: {received}")]
    FailedToParse { expected: String, received: String },
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub window_size: WindowSize<u32>,
    pub log_level: log::LevelFilter,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum WindowSize<T> {
    Default,
    Custom {
        width: T,
        height: T,
    }
}
impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            window_size: WindowSize::Default,
            log_level: log::LevelFilter::Info,
        }
    }
}


lazy_static! {
    static ref CONFIG: RwLock<ServerConfig> = {
        let mut config_path = get_working_dir().expect("faliure");
        config_path.push(".occult.config.toml");
        
        let config = if config_path.exists() {
            match fs::read_to_string(config_path) {
                Ok(contents) => {
                    match toml::from_str(&contents) {
                        Ok(parsed_config) => parsed_config,
                        Err(_) => {
                            eprintln!("Failed to parse config, using default");
                            ServerConfig::default()
                        }
                    }
                }
                Err(e) => {
                    error!("Failed to read config file, using default");
                    
                    ServerConfig::default()
                }
            }
        } else {
            ServerConfig::default()
        };

        RwLock::new(config)
    };
}



pub fn is_initalized() -> bool {
    let mut config_path = get_working_dir().unwrap();
    config_path.push(".occult.config.toml");
    let mut config_path = get_working_dir().expect("faliure");
    config_path.push(".occult.config.toml");
    if config_path.exists() {
        true
    } else {
        false
    }
}

pub fn write_to_path(path: &PathBuf, content: String, file_name: &str) -> Result<()> {
    if !path.exists() {
        debug!("Path did not yet exist: {path:#?}");
        fs::create_dir_all(path)?;
    }
    let mut new_path = path.clone();
    new_path.push(file_name);
    debug!("Full file path: {new_path:#?}");
    let mut file = File::create(&new_path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}
pub fn get_working_dir() -> Result<PathBuf> {
    let mut dir = dirs_next::data_dir()
        .ok_or(anyhow!("Expected working directory, found: None"))
        .context("Could not fetch working dir")?;
    dir.push("occult");
    Ok(dir)
}

pub fn get_data_dir() -> Result<PathBuf> {
    let mut dir = get_working_dir().context("Failed to obtain working dir")?;
    dir.push("data");
    Ok(dir)
}

