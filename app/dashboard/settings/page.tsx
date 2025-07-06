"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Music, Volume2, Monitor } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [colorblindMode, setColorblindMode] = useState(false)
  const [notationSystem, setNotationSystem] = useState<"letter" | "solfege">("letter")
  const [keyboardSize, setKeyboardSize] = useState(80)
  const [volume, setVolume] = useState(70)
  const [showFingerNumbers, setShowFingerNumbers] = useState(true)
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [voiceControl, setVoiceControl] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)

  const saveSettings = () => {
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated.",
    })
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Customize your piano learning experience</p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Manage how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Piano Keyboard Size</Label>
                  <div className="space-y-4">
                    <Slider
                      value={[keyboardSize]}
                      min={50}
                      max={100}
                      step={5}
                      onValueChange={(value) => setKeyboardSize(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller</span>
                      <span>{keyboardSize}%</span>
                      <span>Larger</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Settings */}
          <TabsContent value="accessibility" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visual Accessibility</CardTitle>
                <CardDescription>Adjust settings to improve visibility and readability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="colorblind-mode">Colorblind Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Uses patterns and shapes in addition to colors for visual feedback
                    </p>
                  </div>
                  <Switch id="colorblind-mode" checked={colorblindMode} onCheckedChange={setColorblindMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">Increases contrast for better visibility</p>
                  </div>
                  <Switch id="high-contrast" checked={highContrastMode} onCheckedChange={setHighContrastMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="finger-numbers">Show Finger Numbers</Label>
                    <p className="text-sm text-muted-foreground">Display suggested finger positions on the keyboard</p>
                  </div>
                  <Switch id="finger-numbers" checked={showFingerNumbers} onCheckedChange={setShowFingerNumbers} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Note Naming System</CardTitle>
                <CardDescription>Choose how notes are displayed throughout the app</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={notationSystem}
                  onValueChange={(value) => setNotationSystem(value as "letter" | "solfege")}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="letter" id="letter" />
                    <Label htmlFor="letter" className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Letter Names (C, D, E, F, G, A, B)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solfege" id="solfege" />
                    <Label htmlFor="solfege" className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Solfège (Do, Re, Mi, Fa, Sol, La, Si)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sound Settings</CardTitle>
                <CardDescription>Adjust volume and audio preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Master Volume</Label>
                  <div className="flex items-center gap-4">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-sm">{volume}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-control">Voice Control</Label>
                    <p className="text-sm text-muted-foreground">Enable voice commands and AI voice feedback</p>
                  </div>
                  <Switch id="voice-control" checked={voiceControl} onCheckedChange={setVoiceControl} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Practice Settings */}
          <TabsContent value="practice" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Preferences</CardTitle>
                <CardDescription>Customize your practice experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-scroll">Auto-Scroll Sheet Music</Label>
                    <p className="text-sm text-muted-foreground">Automatically scroll sheet music as you play</p>
                  </div>
                  <Switch id="auto-scroll" checked={autoScroll} onCheckedChange={setAutoScroll} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button onClick={saveSettings}>Save Changes</Button>
        </div>
      </div>
    </DashboardShell>
  )
}
