"use client";

import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Palette, Volume2, MessageSquare, Globe, 
         Monitor, Wifi, CreditCard, Gift, Zap, HelpCircle, Search, X, 
         Moon, Sun, ComputerIcon, Smartphone, Command, Video, Mic, Speaker,
         Type, Image, Link, Hash, AtSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SwitchProps {
  enabled: boolean;
  onChange: () => void;
}

const Switch: React.FC<SwitchProps> = ({ enabled, onChange }) => (
  <div 
    className={`h-6 w-11 ${enabled ? 'bg-blue-500' : 'bg-zinc-700'} rounded-full relative cursor-pointer transition-colors`}
    onClick={onChange}
  >
    <div 
      className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </div>
);

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('My Account');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState({
    notifications: {
      directMessages: true,
      mentions: true,
      serverUpdates: false,
      eventReminders: true,
      sounds: true,
      emailNotifications: false,
      desktopNotifications: true,
      mobileNotifications: true
    },
    appearance: {
      theme: 'dark',
      fontSize: 14,
      chatDensity: 'comfortable',
      messageGrouping: true,
      animatedEmoji: true,
      showTimestamps: true
    },
    privacy: {
      directMessages: 'friends',
      friendRequests: 'everyone',
      activityStatus: true,
      readReceipts: true,
      typingIndicators: true
    },
    audio: {
      inputDevice: 'default',
      outputDevice: 'default',
      inputVolume: 75,
      outputVolume: 85,
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true
    }
  });

  type SettingsCategory = 'notifications' | 'appearance' | 'privacy' | 'audio';
  type NotificationSettings = keyof typeof settings.notifications;
  type AppearanceSettings = keyof typeof settings.appearance;
  type PrivacySettings = keyof typeof settings.privacy;
  type AudioSettings = keyof typeof settings.audio;

  const updateSetting = (category: SettingsCategory, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  // Categories definition with enhanced content
  const categories = [
    { 
      id: 'account', 
      name: 'My Account', 
      icon: User,
      content: (
        <div className="space-y-8">
          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Display Name</span>
                <input 
                  type="text" 
                  defaultValue="@username"
                  className="text-sm bg-black/40 px-3 py-1 rounded border border-zinc-800/50 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Email</span>
                <input 
                  type="email" 
                  defaultValue="user@example.com"
                  className="text-sm bg-black/40 px-3 py-1 rounded border border-zinc-800/50 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Account Status</h3>
            <div className="flex gap-3">
              <div className="flex-1 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
                <div className="text-blue-400 font-medium">Active</div>
                <div className="text-sm text-zinc-400">Last login: 2 hours ago</div>
              </div>
              <div className="flex-1 p-4 rounded-lg bg-black/40 border border-zinc-700/50 backdrop-blur-md">
                <div className="text-zinc-300 font-medium">Premium Status</div>
                <div className="text-sm text-zinc-400">Basic Plan</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'directMessages', label: 'Direct Messages', desc: 'Get notified about new private messages' },
                { key: 'mentions', label: 'Mentions', desc: 'Notifications when someone mentions you' },
                { key: 'serverUpdates', label: 'Server Updates', desc: 'Important announcements and changes' },
                { key: 'eventReminders', label: 'Event Reminders', desc: 'Upcoming events and schedules' },
                { key: 'sounds', label: 'Notification Sounds', desc: 'Play sounds for new notifications' },
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive important updates via email' },
                { key: 'desktopNotifications', label: 'Desktop Notifications', desc: 'Show desktop notifications' },
                { key: 'mobileNotifications', label: 'Mobile Notifications', desc: 'Push notifications on mobile' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-zinc-400">{item.desc}</div>
                  </div>
                  <Switch
                    enabled={settings.notifications[item.key as NotificationSettings]}
                    onChange={() => updateSetting('notifications', item.key as NotificationSettings, !settings.notifications[item.key as NotificationSettings])}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'appearance', 
      name: 'Appearance', 
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button 
                className={`p-4 rounded-lg border ${
                  settings.appearance.theme === 'dark' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-zinc-800/50 bg-black/40'
                } flex items-center gap-2`}
                onClick={() => updateSetting('appearance', 'theme', 'dark')}
              >
                <Moon className="h-5 w-5" />
                <span>Dark</span>
              </button>
              <button 
                className={`p-4 rounded-lg border ${
                  settings.appearance.theme === 'light' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-zinc-800/50 bg-black/40'
                } flex items-center gap-2`}
                onClick={() => updateSetting('appearance', 'theme', 'light')}
              >
                <Sun className="h-5 w-5" />
                <span>Light</span>
              </button>
              <button 
                className={`p-4 rounded-lg border ${
                  settings.appearance.theme === 'system' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-zinc-800/50 bg-black/40'
                } flex items-center gap-2`}
                onClick={() => updateSetting('appearance', 'theme', 'system')}
              >
                <ComputerIcon className="h-5 w-5" />
                <span>System</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Font Size</label>
                <input 
                  type="range" 
                  min="12" 
                  max="20" 
                  value={settings.appearance.fontSize}
                  onChange={(e) => updateSetting('appearance', 'fontSize', parseInt(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-sm text-zinc-400 mt-1">{settings.appearance.fontSize}px</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Message Grouping</div>
                  <div className="text-sm text-zinc-400">Group messages by user</div>
                </div>
                <Switch
                  enabled={settings.appearance.messageGrouping}
                  onChange={() => updateSetting('appearance', 'messageGrouping', !settings.appearance.messageGrouping)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Animated Emoji</div>
                  <div className="text-sm text-zinc-400">Enable animated emoji</div>
                </div>
                <Switch
                  enabled={settings.appearance.animatedEmoji}
                  onChange={() => updateSetting('appearance', 'animatedEmoji', !settings.appearance.animatedEmoji)}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'audio', 
      name: 'Voice & Video', 
      icon: Volume2,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Input Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Input Volume</label>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={settings.audio.inputVolume}
                    onChange={(e) => updateSetting('audio', 'inputVolume', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{settings.audio.inputVolume}%</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-zinc-400">Output Volume</label>
                <div className="flex items-center gap-2">
                  <Speaker className="h-4 w-4" />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={settings.audio.outputVolume}
                    onChange={(e) => updateSetting('audio', 'outputVolume', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{settings.audio.outputVolume}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Noise Suppression</div>
                  <div className="text-sm text-zinc-400">Reduce background noise</div>
                </div>
                <Switch
                  enabled={settings.audio.noiseSuppression}
                  onChange={() => updateSetting('audio', 'noiseSuppression', !settings.audio.noiseSuppression)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Echo Cancellation</div>
                  <div className="text-sm text-zinc-400">Prevent audio feedback</div>
                </div>
                <Switch
                  enabled={settings.audio.echoCancellation}
                  onChange={() => updateSetting('audio', 'echoCancellation', !settings.audio.echoCancellation)}
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Video Settings</h3>
            <div className="aspect-video mb-4 rounded-lg bg-black/40 border border-zinc-800/50 flex items-center justify-center">
              <Video className="h-8 w-8 text-zinc-500" />
            </div>
            <select className="w-full bg-black/40 border border-zinc-800/50 rounded px-3 py-2 text-sm">
              <option>FaceTime HD Camera</option>
              <option>External Webcam</option>
            </select>
          </div>
        </div>
      )
    },
    { 
      id: 'privacy', 
      name: 'Privacy & Safety', 
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Direct Messages</div>
                  <div className="text-sm text-zinc-400">Control who can send you messages</div>
                </div>
                <select 
                  className="bg-black/40 border-zinc-700/50 rounded px-3 py-1 text-sm backdrop-blur-sm"
                  value={settings.privacy.directMessages}
                  onChange={(e) => updateSetting('privacy', 'directMessages', e.target.value)}
                >
                  <option value="everyone">Everyone</option>
                  <option value="friends">Friends Only</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Read Receipts</div>
                  <div className="text-sm text-zinc-400">Show when you've read messages</div>
                </div>
                <Switch
                  enabled={settings.privacy.readReceipts}
                  onChange={() => updateSetting('privacy', 'readReceipts', !settings.privacy.readReceipts)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Activity Status</div>
                  <div className="text-sm text-zinc-400">Show your online status</div>
                </div>
                <Switch
                  enabled={settings.privacy.activityStatus}
                  onChange={() => updateSetting('privacy', 'activityStatus', !settings.privacy.activityStatus)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Typing Indicators</div>
                  <div className="text-sm text-zinc-400">Show when you're typing</div>
                </div>
                <Switch
                  enabled={settings.privacy.typingIndicators}
                  onChange={() => updateSetting('privacy', 'typingIndicators', !settings.privacy.typingIndicators)}
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
            <h3 className="text-lg font-medium mb-4">Safety Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Shield className="h-5 w-5 text-blue-400 mr-3" />
                <div className="flex-1">
                  <div className="font-medium">Safety Mode</div>
                  <div className="text-sm text-zinc-400">Enhanced protection against unwanted interactions</div>
                </div>
                <Switch enabled={true} onChange={() => {}} />
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'text', 
      name: 'Text & Media', 
      icon: MessageSquare,
      content: (
        <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
          <h3 className="text-lg font-medium mb-4">Text & Media Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-zinc-400">Message Display</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">Compact</button>
                <button className="p-3 rounded-lg bg-black/40 border border-zinc-800/50 text-sm">Cozy</button>
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Link Preview</label>
              <div className="mt-2 p-4 rounded-lg bg-black/40 border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Link className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium">Show Link Previews</div>
                    <div className="text-sm text-zinc-400">Display previews for links you send</div>
                  </div>
                  <Switch enabled={true} onChange={() => {}} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Image Auto-Play</label>
              <div className="mt-2 p-4 rounded-lg bg-black/40 border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Image className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium">Auto-play GIFs</div>
                    <div className="text-sm text-zinc-400">Automatically play animated images</div>
                  </div>
                  <Switch enabled={true} onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'language', 
      name: 'Language', 
      icon: Globe,
      content: (
        <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
          <h3 className="text-lg font-medium mb-4">Language Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Display Language</label>
              <select className="w-full mt-2 bg-black/40 border border-zinc-800/50 rounded px-3 py-2">
                <option>English (US)</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>日本語</option>
                <option>한국어</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Spell Check</div>
                <div className="text-sm text-zinc-400">Check spelling as you type</div>
              </div>
              <Switch enabled={true} onChange={() => {}} />
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'keyboard', 
      name: 'Keyboard', 
      icon: Command,
      content: (
        <div className="p-6 rounded-xl bg-black/30 backdrop-blur-md backdrop-saturate-150 border border-zinc-800/50 shadow-lg">
          <h3 className="text-lg font-medium mb-4">Keyboard Shortcuts</h3>
          <div className="space-y-3">
            {[
              { key: '⌘ K', action: 'Quick Search' },
              { key: '⌘ /', action: 'Toggle Sidebar' },
              { key: '⌘ .', action: 'Settings' },
              { key: '⌘ ↵', action: 'Send Message' },
              { key: '⌘ ↑', action: 'Edit Last Message' }
            ].map(shortcut => (
              <div key={shortcut.key} className="flex items-center justify-between p-2 rounded bg-black/20">
                <span className="text-zinc-400">{shortcut.action}</span>
                <span className="px-2 py-1 rounded bg-black/40 border border-zinc-800/50 text-sm font-mono">
                  {shortcut.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContent = categories.find(cat => cat.name === activeCategory)?.content;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex w-[1200px] mx-auto my-10 rounded-xl overflow-hidden bg-zinc-400/1 backdrop-blur-xl backdrop-saturate-150">
        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-800/50 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-blue-400">
              <Settings className="h-5 w-5" />
              User Settings
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-zinc-800/50 rounded-lg px-4 py-2 pl-10 text-sm 
                       placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-lg"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors
                    ${activeCategory === category.name 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">{activeCategory}</h1>

            <Alert className="mb-6 border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
              <AlertDescription>
                Settings are automatically saved as you make changes
              </AlertDescription>
            </Alert>

            {/* Dynamic Content */}
            {activeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;