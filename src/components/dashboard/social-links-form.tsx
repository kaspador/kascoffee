'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  ExternalLink,
  Twitter,
  Globe,
  MessageCircle,
  Eye,
  EyeOff,
  Save,
  Edit,
  LinkIcon
} from 'lucide-react';

interface Social {
  id: string;
  platform: string;
  url: string;
  username?: string | null;
  is_visible: boolean;
}

interface SocialLinksFormProps {
  socials: Social[];
  isLoading: boolean;
  onSuccess?: () => void;
}

const socialPlatforms = [
  { value: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username', color: '#1DA1F2' },
  { value: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/invite', color: '#5865F2' },
  { value: 'telegram', label: 'Telegram', icon: MessageCircle, placeholder: 'https://t.me/username', color: '#0088CC' },
  { value: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com', color: '#70C7BA' },
];

export function SocialLinksForm({ socials: initialSocials, isLoading, onSuccess }: SocialLinksFormProps) {
  const [socials, setSocials] = useState<Social[]>(initialSocials || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSocial, setNewSocial] = useState({
    platform: '',
    url: '',
    username: '',
    is_visible: true
  });

  // Update socials when props change
  useEffect(() => {
    setSocials(initialSocials || []);
  }, [initialSocials]);

  const getPlatformIcon = (platform: string, color?: string, size: string = "w-4 h-4") => {
    const platformData = socialPlatforms.find(p => p.value === platform);
    const Icon = platformData?.icon || Globe;
    return <Icon className={size} style={color ? { color } : undefined} />;
  };

  const getPlatformLabel = (platform: string) => {
    return socialPlatforms.find(p => p.value === platform)?.label || platform;
  };

  const getPlatformColor = (platform: string) => {
    return socialPlatforms.find(p => p.value === platform)?.color || '#70C7BA';
  };

  const handleCreateSocial = async () => {
    if (!newSocial.platform || !newSocial.url) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSocial)
      });

      if (response.ok) {
        const { social } = await response.json();
        setSocials(prev => [...prev, social]);
        setNewSocial({ platform: '', url: '', username: '', is_visible: true });
        onSuccess?.();
      } else {
        throw new Error('Failed to create social link');
      }
    } catch (error) {
      console.error('Error creating social:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSocial = async (id: string, data: Partial<Social>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });

      if (response.ok) {
        const { social } = await response.json();
        setSocials(prev => prev.map(s => s.id === id ? social : s));
        setEditingId(null);
        onSuccess?.();
      } else {
        throw new Error('Failed to update social link');
      }
    } catch (error) {
      console.error('Error updating social:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/user/socials?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSocials(prev => prev.filter(s => s.id !== id));
        onSuccess?.();
      } else {
        throw new Error('Failed to delete social link');
      }
    } catch (error) {
      console.error('Error deleting social:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (id: string, is_visible: boolean) => {
    await handleUpdateSocial(id, { is_visible });
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#70C7BA] mx-auto"></div>
            <p className="text-gray-400 mt-4 font-kaspa-subheader">Loading social links...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-kaspa-header font-bold text-white flex items-center gap-3">
          <LinkIcon className="w-6 h-6 text-[#70C7BA]" />
          Social Media Links
        </CardTitle>
        <p className="text-gray-400 text-sm font-kaspa-subheader">
          Connect your social media accounts to display on your donation page and build trust with your supporters.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Add New Social Link */}
        <div className="space-y-6 p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#70C7BA] to-[#49EACB] rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-kaspa-subheader font-bold text-white">Add New Social Link</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-white text-sm font-kaspa-subheader font-semibold">Platform</Label>
              <Select 
                value={newSocial.platform} 
                onValueChange={(value) => setNewSocial(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger className="w-full bg-white/10 border-white/30 text-white hover:bg-white/15 focus:border-[#70C7BA] focus:ring-2 focus:ring-[#70C7BA]/50 transition-all duration-200 h-12">
                  <SelectValue placeholder="Select platform" className="text-gray-300" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl z-[9999]">
                  {socialPlatforms.map(platform => (
                    <SelectItem 
                      key={platform.value} 
                      value={platform.value}
                      className="text-white hover:bg-white/10 focus:bg-white/15 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                        <span className="font-kaspa-subheader">{platform.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white text-sm font-kaspa-subheader font-semibold">URL</Label>
              <Input
                placeholder={socialPlatforms.find(p => p.value === newSocial.platform)?.placeholder || "Enter URL"}
                value={newSocial.url}
                onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-[#70C7BA] focus:ring-2 focus:ring-[#70C7BA]/50 transition-all duration-200 h-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white text-sm font-kaspa-subheader font-semibold">Username (optional)</Label>
            <Input
              placeholder="@username or display name"
              value={newSocial.username}
              onChange={(e) => setNewSocial(prev => ({ ...prev, username: e.target.value }))}
              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-[#70C7BA] focus:ring-2 focus:ring-[#70C7BA]/50 transition-all duration-200 h-12"
            />
          </div>

          <Button 
            onClick={handleCreateSocial}
            disabled={!newSocial.platform || !newSocial.url || isSubmitting}
            className="w-full sm:w-auto bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white px-8 py-4 font-kaspa-subheader font-bold rounded-xl shadow-lg hover:shadow-[#70C7BA]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>

        {/* Existing Social Links */}
        {socials.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#49EACB] to-[#70C7BA] rounded-full flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-kaspa-subheader font-bold text-white">Your Social Links</h3>
              <Badge variant="secondary" className="bg-[#70C7BA]/20 text-[#70C7BA] border-[#70C7BA]/30">
                {socials.filter(s => s.is_visible).length} visible
              </Badge>
            </div>
            <div className="grid gap-4">
              {socials.map((social) => (
                <SocialLinkCard
                  key={social.id}
                  social={social}
                  isEditing={editingId === social.id}
                  isSubmitting={isSubmitting}
                  onEdit={() => setEditingId(social.id)}
                  onCancel={() => setEditingId(null)}
                  onSave={(data) => handleUpdateSocial(social.id, data)}
                  onDelete={() => handleDeleteSocial(social.id)}
                  onToggleVisibility={(is_visible) => toggleVisibility(social.id, is_visible)}
                  getPlatformIcon={getPlatformIcon}
                  getPlatformLabel={getPlatformLabel}
                  getPlatformColor={getPlatformColor}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#70C7BA]/20 to-[#49EACB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-[#70C7BA] opacity-60" />
            </div>
            <h4 className="text-lg font-kaspa-subheader font-bold text-white mb-2">No social links yet</h4>
            <p className="text-gray-400 text-sm font-kaspa-subheader">Add your first social link above to start building your online presence</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Separate component for individual social link cards
interface SocialLinkCardProps {
  social: Social;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (data: Partial<Social>) => void;
  onDelete: () => void;
  onToggleVisibility: (is_visible: boolean) => void;
  getPlatformIcon: (platform: string, color?: string, size?: string) => React.ReactElement;
  getPlatformLabel: (platform: string) => string;
  getPlatformColor: (platform: string) => string;
}

function SocialLinkCard({
  social,
  isEditing,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onToggleVisibility,
  getPlatformIcon,
  getPlatformLabel,
  getPlatformColor
}: SocialLinkCardProps) {
  const [editData, setEditData] = useState({
    url: social.url,
    username: social.username || ''
  });

  const handleSave = () => {
    onSave({
      url: editData.url,
      username: editData.username || null
    });
  };

  if (isEditing) {
    return (
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-[#70C7BA]/30 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
                         <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${getPlatformColor(social.platform)}20` }}>
                 {getPlatformIcon(social.platform, getPlatformColor(social.platform))}
               </div>
              <span className="font-kaspa-subheader font-bold text-white text-lg">
                Edit {getPlatformLabel(social.platform)}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white text-sm font-kaspa-subheader font-semibold">URL</Label>
                <Input
                  value={editData.url}
                  onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white mt-2 focus:border-[#70C7BA] focus:ring-2 focus:ring-[#70C7BA]/50 transition-all duration-200 h-12"
                />
              </div>
              <div>
                <Label className="text-white text-sm font-kaspa-subheader font-semibold">Username (optional)</Label>
                <Input
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white mt-2 focus:border-[#70C7BA] focus:ring-2 focus:ring-[#70C7BA]/50 transition-all duration-200 h-12"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-kaspa-subheader font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-kaspa-subheader font-semibold rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 hover:border-white/30 hover:from-white/10 hover:to-white/15 transition-all duration-300 shadow-lg group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4 flex-1 min-w-0">
             <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getPlatformColor(social.platform)}20` }}>
               {getPlatformIcon(social.platform, getPlatformColor(social.platform), "w-5 h-5")}
             </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-kaspa-subheader font-bold text-white text-lg">
                  {getPlatformLabel(social.platform)}
                </span>
                <Badge 
                  variant={social.is_visible ? "default" : "secondary"} 
                  className={`text-xs font-kaspa-subheader ${
                    social.is_visible 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  }`}
                >
                  {social.is_visible ? "Visible" : "Hidden"}
                </Badge>
              </div>
              {social.username && (
                <p className="text-sm text-gray-300 truncate font-kaspa-subheader">@{social.username}</p>
              )}
              <p className="text-xs text-gray-400 truncate font-mono">{social.url}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              onClick={() => window.open(social.url, '_blank')}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 h-auto rounded-lg transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onToggleVisibility(!social.is_visible)}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 h-auto rounded-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              {social.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onEdit}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 h-auto rounded-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 h-auto rounded-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 