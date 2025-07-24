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

  const getPlatformIcon = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.value === platform);
    const Icon = platformData?.icon || Globe;
    return <Icon className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Connect your social media accounts to appear on your donation page
      </div>

      {/* Existing Socials */}
      {socials.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Social Links</h4>
          {socials.map((social) => (
            <Card key={social.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(social.platform)}
                    <div>
                      <div className="font-medium capitalize">{social.platform}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {social.url}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={social.isVisible ? 'default' : 'secondary'}>
                      {social.isVisible ? 'Visible' : 'Hidden'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(social.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
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

      {/* Add New Social */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Social Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
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
            <div>
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                placeholder="@username"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                defaultChecked
                className="rounded"
              />
              <Label htmlFor="isVisible" className="text-sm">
                Show on donation page
              </Label>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {socials.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No social links added yet. Add your first social link above.
        </div>
      )}
    </div>
  );
} 