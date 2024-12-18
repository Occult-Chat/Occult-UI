import React, { useState, useCallback, useMemo } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorPlay, 
         Settings, PhoneOff, Maximize2 } from 'lucide-react';
import ScreenMirror from './ScreenMirror';

interface Participant {
  id: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isPinned: boolean;
  avatarUrl?: string;
}

interface CallUIProps {
  participants: Participant[];
  currentUserId: string;
  onToggleVideo?: () => void;
  onToggleAudio?: () => void;
  onShareScreen?: () => void;
  onLeaveCall?: () => void;
}

const ParticipantTile = React.memo(({ participant }: { participant: Participant }) => {
  const videoPlaceholder = (
    <div className="bg-[#111111] rounded-md flex items-center justify-center h-full">
      <div className="w-10 h-10 rounded-full bg-[#5865f2] 
                    flex items-center justify-center text-sm font-medium text-white">
        {participant.name.charAt(0).toUpperCase()}
      </div>
    </div>
  );

  return (
    <div className="relative rounded-md overflow-hidden h-40 bg-[#111111]">
      {participant.isVideoOn ? (
        <div className="w-full h-full">
          {videoPlaceholder}
        </div>
      ) : videoPlaceholder}
      
      <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/60">
        <div className="flex items-center gap-1.5">
          <span className="text-white text-xs font-medium">{participant.name}</span>
          <div className="flex gap-0.5">
            {!participant.isAudioOn && 
              <div className="bg-[#ed4245] p-0.5 rounded">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            }
            {participant.isScreenSharing && 
              <div className="bg-[#5865f2] p-0.5 rounded">
                <MonitorPlay className="w-3 h-3 text-white" />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
});

const CallUI = ({
  participants,
  currentUserId,
  onToggleVideo,
  onToggleAudio,
  onShareScreen,
  onLeaveCall
}: CallUIProps) => {
  const currentUser = useMemo(() => 
    participants.find(p => p.id === currentUserId),
    [participants, currentUserId]
  );

  const otherParticipants = useMemo(() => 
    participants.filter(p => p.id !== currentUserId),
    [participants, currentUserId]
  );

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900">
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {otherParticipants.map(participant => (
            <ParticipantTile
              key={participant.id}
              participant={participant}
            />
          ))}
        </div>
      </div>
      
      {/* Centered Controls */}
      <div className="p-3 bg-[#090909]">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <button
            onClick={onToggleAudio}
            className={`p-2.5 rounded-md transition-colors ${
              currentUser.isAudioOn ? 'bg-[#36393f] hover:bg-[#40444b]' : 'bg-[#ed4245] hover:bg-[#ed4245]/90'
            }`}
          >
            {currentUser.isAudioOn ? 
              <Mic className="w-5 h-5 text-white" /> : 
              <MicOff className="w-5 h-5 text-white" />
            }
          </button>
          <button
            onClick={onToggleVideo}
            className="p-2.5 rounded-md bg-[#36393f] hover:bg-[#40444b] transition-colors"
          >
            {currentUser.isVideoOn ? 
              <Video className="w-5 h-5 text-white" /> : 
              <VideoOff className="w-5 h-5 text-white" />
            }
          </button>

          <ScreenMirror/>

          <div className="w-px h-6 bg-[#36393f]" />
          <button 
            className="p-2.5 rounded-md bg-[#36393f] hover:bg-[#40444b] transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onLeaveCall}
            className="p-2.5 rounded-md bg-[#ed4245] hover:bg-[#ed4245]/90 transition-colors"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallUI;