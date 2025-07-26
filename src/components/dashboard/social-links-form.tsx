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
  Github,
  Globe,
  MessageCircle,
  Eye,
  EyeOff,
  Save,
  Edit
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
  { value: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { value: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/invite' },
  { value: 'telegram', label: 'Telegram', icon: MessageCircle, placeholder: 'https://t.me/username' },
  { value: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
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

  const getPlatformIcon = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.value === platform);
    const Icon = platformData?.icon || Globe;
    return <Icon className="w-4 h-4" />;
  };

  const getPlatformLabel = (platform: string) => {
    return socialPlatforms.find(p => p.value === platform)?.label || platform;
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
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#70C7BA] mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading social links...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-kaspa-header font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#70C7BA]" />
          Social Links
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Add your social media links to display on your donation page
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Social Link */}
        <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-kaspa-subheader font-bold text-white">Add New Social Link</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white text-sm font-kaspa-subheader">Platform</Label>
              <Select 
                value={newSocial.platform} 
                onValueChange={(value) => setNewSocial(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map(platform => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <platform.icon className="w-4 h-4" />
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm font-kaspa-subheader">URL</Label>
              <Input
                placeholder={socialPlatforms.find(p => p.value === newSocial.platform)?.placeholder || "Enter URL"}
                value={newSocial.url}
                onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm font-kaspa-subheader">Username (optional)</Label>
            <Input
              placeholder="@username or display name"
              value={newSocial.username}
              onChange={(e) => setNewSocial(prev => ({ ...prev, username: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <Button 
            onClick={handleCreateSocial}
            disabled={!newSocial.platform || !newSocial.url || isSubmitting}
            className="bg-gradient-to-r from-[#70C7BA] to-[#49EACB] hover:from-[#5ba8a0] hover:to-[#3dd4b4] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>

        {/* Existing Social Links */}
        {socials.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-kaspa-subheader font-bold text-white">Your Social Links</h3>
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No social links added yet</p>
            <p className="text-sm">Add your first social link above</p>
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
  getPlatformIcon: (platform: string) => React.ReactElement;
  getPlatformLabel: (platform: string) => string;
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
  getPlatformLabel
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
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {getPlatformIcon(social.platform)}
              <span className="font-kaspa-subheader font-bold text-white">
                {getPlatformLabel(social.platform)}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-white text-sm">URL</Label>
                <Input
                  value={editData.url}
                  onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Username (optional)</Label>
                <Input
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
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
    <Card className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getPlatformIcon(social.platform)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-kaspa-subheader font-bold text-white">
                  {getPlatformLabel(social.platform)}
                </span>
                <Badge variant={social.is_visible ? "default" : "secondary"} className="text-xs">
                  {social.is_visible ? "Visible" : "Hidden"}
                </Badge>
              </div>
              {social.username && (
                <p className="text-sm text-gray-300 truncate">@{social.username}</p>
              )}
              <p className="text-xs text-gray-400 truncate">{social.url}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              onClick={() => window.open(social.url, '_blank')}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white p-1 h-auto"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onToggleVisibility(!social.is_visible)}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white p-1 h-auto"
              disabled={isSubmitting}
            >
              {social.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
            <Button
              onClick={onEdit}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white p-1 h-auto"
              disabled={isSubmitting}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-red-400 p-1 h-auto"
              disabled={isSubmitting}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 