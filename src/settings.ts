import { App, PluginSettingTab, Setting } from "obsidian";
import CaseStudyFigmaPlugin from "./main";

export interface CaseStudyFigmaSettings {
  mySetting: string;
}

export const DEFAULT_SETTINGS: CaseStudyFigmaSettings = {
  mySetting: "default",
};

export class CaseStudyFigmaSettingTab extends PluginSettingTab {
  plugin: CaseStudyFigmaPlugin;

  constructor(app: App, plugin: CaseStudyFigmaPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Settings #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
