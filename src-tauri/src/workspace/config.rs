use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationConfig {
    pub direct_messages: bool,
    pub mentions: bool,
    pub server_updates: bool,
    pub event_reminders: bool,
    pub play_notification_sounds: bool,
    pub email_notifications: bool,
    pub desktop_notifications: bool,
    pub mobile_notifications: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum Theme {
    #[default]
    Dark,
    Light,
    System,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppearanceConfig {
    pub current_theme_variation: Theme,
    pub font_size: u8,
    pub allow_message_grouping: bool,
    pub animate_emoji: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize, Default)]

pub enum IOType {
    #[default]
    None,
    Default(String),
    Custom(String),
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VVConfig {
    pub input_vol: u16,
    pub output_vol: u16,
    pub input_device: IOType,
    pub output_device: IOType,
    pub noise_spression: bool,
    pub echo_cancellation: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum AllowList {
    #[default]
    Everyone,
    FriendsOnly,
    Nobody,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrivacyConfig {
    pub read_receipts: bool, // if you implement this ill beat you in a minecraft pvp match for legal reasons - Caz
    pub show_activity_status: bool,
    pub show_typing_indicator: bool,
    pub safety_mode: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextConfig {
    pub compact_mode: bool,
    pub show_link_preview: bool,
    pub auto_play_gifs: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum Language {
    #[default]
    Auto,
    English,
    EnglishSimplified,
    French,
    Deutsch,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanguageConfig {
    pub current_language: Language,
    pub spell_check: bool,
}
