use config::AppearanceConfig;
use config::NotificationConfig;
use config::PrivacyConfig;
use config::VVConfig;
use parking_lot::RwLock;
use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

use anyhow::anyhow;
use anyhow::Context;
use anyhow::Result;
use lazy_static::lazy_static;
use log::debug;
use log::error;
use serde::{Deserialize, Serialize};
use thiserror::Error;
pub mod config;
#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("Invalid port number. expected value in range 1..65535 got {received}")]
    InvalidPort { received: u32 },
    #[error("Failed to parse value. Expected {expected}. Got: {received}")]
    FailedToParse { expected: String, received: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ClientConfig {
    pub log_level: log::LevelFilter,
    pub notification_settings: NotificationConfig,
    pub voice_video_settings: VVConfig,
    pub pivacy_settings: PrivacyConfig,
    pub language_settings: config::LanguageConfig,
    pub appearance: AppearanceConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize,Default)]
pub enum WindowSize<T> {
    #[default]
    Default,
    Custom { width: T, height: T },
}
#[derive(Debug, Clone, Serialize, Deserialize,Default)]
pub struct ClientCache {
    pub window_size: WindowSize<u32>,
}


impl Default for ClientConfig {
    fn default() -> Self {
        Self {
            log_level: log::LevelFilter::Info,
            notification_settings: NotificationConfig {
                direct_messages: true,
                mentions: true,
                server_updates: true,
                event_reminders: true,
                play_notification_sounds: true,
                email_notifications: false,
                desktop_notifications: true,
                mobile_notifications: true,
            },
            voice_video_settings: VVConfig {
                input_vol: 100,
                output_vol: 100,
                input_device: config::IOType::None,
                output_device: config::IOType::None,
                noise_spression: true,
                echo_cancellation: true,
            },
            pivacy_settings: PrivacyConfig {
                read_receipts: false,
                show_activity_status: true,
                show_typing_indicator: true,
                safety_mode: false,
            },
            language_settings: config::LanguageConfig {
                current_language: config::Language::Auto,
                spell_check: true,
            },
            appearance: AppearanceConfig {
                current_theme_variation: config::Theme::System,
                font_size: 12,
                allow_message_grouping: true,
                animate_emoji: true,
            },
        }
    }
}

lazy_static! {
    pub static ref CONFIG: RwLock<ClientConfig> = {
        let mut config_path = get_working_dir().expect("failure to get working directory");
        config_path.push(".occult.config.toml");

        let config = match config_path.parent() {
            Some(parent_dir) => {
                // Ensure parent directory exists
                fs::create_dir_all(parent_dir).expect("Failed to create config directory");

                // Try to read existing config
                match fs::read_to_string(&config_path) {
                    Ok(contents) => match toml::from_str(&contents) {
                        Ok(parsed_config) => {
                            println!("Read configuration");
                            parsed_config
                        },
                        Err(e) => {
                            println!("Failed to parse config: {}", e);
                            ClientConfig::default()
                        }
                    },
                    Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                        // File does not exist (first run), create default config
                        let default_config = ClientConfig::default();
                        let default_toml = toml::to_string_pretty(&default_config)
                            .expect("Failed to serialize default config");

                        fs::write(&config_path, default_toml)
                            .expect("Failed to write default config");

                        default_config
                    },
                    Err(_) => {
                        // Other read errors (permissions, etc.)
                        println!("Failed to read config file");
                        ClientConfig::default()
                    }
                }
            },
            None => {
                println!("Invalid config path");
                ClientConfig::default()
            }
        };

        RwLock::new(config)
    };
    pub static ref CACHE: RwLock<ClientCache> = {
        let mut config_path = get_working_dir().expect("failure to get working directory");
        config_path.push(".occult.cache.toml");

        let config = match config_path.parent() {
            Some(parent_dir) => {
                // Ensure parent directory exists
                fs::create_dir_all(parent_dir).expect("Failed to create config directory");

                // Try to read existing config
                match fs::read_to_string(&config_path) {
                    Ok(contents) => match toml::from_str(&contents) {
                        Ok(parsed_config) => {
                            println!("Read configuration");
                            parsed_config
                        },
                        Err(e) => {
                            println!("Failed to parse cache: {}", e);
                            ClientCache::default()
                        }
                    },
                    Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                        // File does not exist (first run), create default config
                        let default_config = ClientCache::default();
                        let default_toml = toml::to_string_pretty(&default_config)
                            .expect("Failed to serialize default cache");

                        fs::write(&config_path, default_toml)
                            .expect("Failed to write default cache");

                        default_config
                    },
                    Err(_) => {
                        // Other read errors (permissions, etc.)
                        println!("Failed to read cache file");
                        ClientCache::default()
                    }
                }
            },
            None => {
                println!("Invalid config path");
                ClientCache::default()
            }
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
