'use client';

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
  MessageCircle
} from 'lucide-react';

interface Social {
  id: string;
  platform: string;
  url: string;
  username?: string | null;
  isVisible: boolean;
}

interface SocialLinksFormProps {
  socials: Social[];
  isLoading: boolean;
  onSuccess?: () => void;
}

const socialPlatforms = [
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'discord', label: 'Discord', icon: MessageCircle },
  { value: 'website', label: 'Website', icon: Globe },
];

export function SocialLinksForm({ socials: initialSocials, isLoading, onSuccess }: SocialLinksFormProps) {
  // Mock form since we're not connected to database
  const socials = initialSocials || [];
  
  // Suppress unused parameter warning - onSuccess will be used when form is implemented
  void onSuccess;

  const getPlatformIcon = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.value === platform);
    const Icon = platformData?.icon || Globe;
    return <Icon className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[#70C7BA]/10 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-[#70C7BA]/80">
        Connect your social media accounts to appear on your donation page
      </div>

      {/* Existing Socials */}
      {socials.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-white">Your Social Links</h4>
          {socials.map((social) => (
            <Card key={social.id} className="bg-white/5 border-[#70C7BA]/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[#70C7BA]">
                      {getPlatformIcon(social.platform)}
                    </div>
                    <div>
                      <div className="font-medium capitalize text-white">{social.platform}</div>
                      <div className="text-sm text-[#70C7BA]/70 truncate max-w-xs">
                        {social.url}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={social.isVisible ? 'default' : 'secondary'}
                      className={social.isVisible ? 'bg-[#70C7BA] text-white' : 'bg-white/10 text-[#70C7BA]/70'}
                    >
                      {social.isVisible ? 'Visible' : 'Hidden'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(social.url, '_blank')}
                      className="text-[#70C7BA] hover:bg-[#70C7BA]/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Social Link Form */}
      <Card className="bg-white/5 border-[#70C7BA]/30">
        <CardHeader>
          <CardTitle className="text-lg text-white">Add Social Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform" className="text-[#70C7BA]">Platform</Label>
              <Select>
                <SelectTrigger className="bg-white/5 border-[#70C7BA]/30 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-[#70C7BA]/30">
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value} className="text-white hover:bg-[#70C7BA]/20">
                      <div className="flex items-center gap-2">
                        <platform.icon className="w-4 h-4" />
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="username" className="text-[#70C7BA]">Username (optional)</Label>
              <Input
                id="username"
                placeholder="@username"
                className="bg-white/5 border-[#70C7BA]/30 text-white placeholder:text-[#70C7BA]/50"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="url" className="text-[#70C7BA]">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              className="bg-white/5 border-[#70C7BA]/30 text-white placeholder:text-[#70C7BA]/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                defaultChecked
                className="rounded accent-[#70C7BA]"
              />
              <Label htmlFor="isVisible" className="text-sm text-[#70C7BA]/80">
                Show on donation page
              </Label>
            </div>
            <Button className="bg-[#70C7BA] hover:bg-[#5ba8a0] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {socials.length === 0 && (
        <div className="text-center py-8 text-[#70C7BA]/60">
          No social links added yet. Add your first social link above.
        </div>
      )}
    </div>
  );
} 