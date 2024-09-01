import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
// import ExampleSettingTab from "./settings";

// Lorem Ipsum texts
const loremIpsumText = [
	{
		name: "Lorem Ipsum",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	},
	{
		name: "Lorem Obsidian",
		text: "Lorem Obsidian vaultus linkum internum graphum notae, backlinkius et metadata exploratio. Markdown file conservo in notus localis, pluginus et customizare workflow continuum. Graphum visualis connexiones nota, zettelkasten methodum per nodus internus scriptum. Syncus optio extra servitium, omnia sub controllo tuo. Daily notae journalis vinculo ad tempus tempus. Databasis personae in cerebrum secundum, fluxus ideae per tagum et queryum. Workflow personalis evolutio, backlinkus ad punctum focus. Proiectus et researchus per notae infiniti networkum, iterum reversum per navigatio linea tempus. Omnia nota linked, graphum dynamica creata in nodus Obsidian.",
	},
	{
		name: "Lorem Animals",
		text: "Leo felis elephantus volatilis, canis aquila in silva. Vulpes et cervus cursu festinant, leo rugit ex montibus. Avis ciconia et pisces in flumine placide natant, dum felis leniter per prata ambulat. Elephantus magna in planitie, et vulpes ingeniosa cuniculos in terram fodit. Ursus dormit in hiberno cubili, et equus rapidus per campos currit.",
	},
	{
		name: "Lorem Food",
		text: "Lorem cibus panis crustum calidum, olivae et caseus fundens. Uvae rubrae et virides, cum melle dulci et lacte. Vinum rubrum et album, cum ficis maturis et nucibus. Poma crocante, dulcia et pira suavia, omnia servita cum pane fragrante. Cibus et convivium cum carne assata, vegetabilium mixtura et herbis aromaticae. Aqua frigidissima, cum limone recenti et menta.",
	},
	{
		name: "Lorem Space",
		text: "Lorem astrum stellae fulgent in caelo profundo, planetae circum solem revolvuntur. Cometae caudas longas per vacuum trahunt, dum asteroides in infinitum errant. Nebulae coloribus vividis, quas universum pingit, et luna silente super terras lucet. Galaxiae spiralis in spatio infinito, quas astronautae ex statione observant. Solaris aura et nebula cosmica per sidera vehuntur.",
	},
	{
		name: "Lorem Nature",
		text: "Lorem natura flumina tranquilla per valles fluunt, montes altissimi nubibus tangunt. Silvae densa cum foliis viridibus, aves canentes inter ramos. Mare vastum, undis ad litora allidentibus, dum sol occidens caelum rubrum pingit. Flores variis coloribus in pratis, et ventus mollis per agros sibilans. Tempestas tonitrua cum pluvia, quae terram aridam reficit.",
	},
	{
		name: "Lorem Technology",
		text: "Lorem technologia circuitus electrici per machinas currunt, bytes et bits per celerem interrete fluitant. Computatores in calculo comples, algorithmis complexis laborant. Satellites orbi terrarum circumvolant, dum drona aere volitant. Robotica manus in officinae, precise movens et connectens. Databasis magnae, informationes copiosas continentes, et codex in tabulis scripta.",
	},
	{
		name: "Lorem Fantasy",
		text: "Lorem phantasia dracones ignem spirantes super montes volant, dum magi incantationes arcanae susurrant. Elves in silvis silentes, sagittas argenteas parant, et reges antiquos in castella de marmore. Potionum vapores in ollis bulliunt, dum unicorni in campis magicis currunt. Fortitudo et sapientia, claves ad regna longinqua, et aventurae in terras incognitas.",
	},
];

const loremIpsumList = loremIpsumText.map((text, index) => ({
	id: index,
	name: text.name,
}));

interface LoremIpsumSettings {
	mySetting: string;
	ribbonIcon: boolean;
	defaultLoremIpsumText: string;
}

const DEFAULT_SETTINGS: LoremIpsumSettings = {
	mySetting: "default",
	ribbonIcon: false,
	defaultLoremIpsumText: loremIpsumText[0].text,
};

export default class LoremIpsum extends Plugin {
	settings: LoremIpsumSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"lines-of-text",
			"Lorem Ipsum Generator",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("You just Lorem Ipsum me!");
			}
		);

		// Perform additional things with the ribbon
		if (this.settings.ribbonIcon === false) {
			// ribbonIconEl.addClass();
		}

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "default-lorem-ipsum-command",
			name: "Default",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection(this.settings.defaultLoremIpsumText);
			},
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "advanced-lorem-ipsum-command",
			name: "Advanced",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: LoremIpsum;

	constructor(app: App, plugin: LoremIpsum) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Default text")
			.setDesc(
				"Select the default text to be inserted, when you call 'Lorem Ipsum Generator: Default' command or click an ribbon icon."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
							loremIpsumList.reduce((acc, item) => {
								acc[item.id.toString()] = item.name;
								return acc;
							}, {} as Record<string, string>)
						)
					.onChange(async (value) => {})
			);

		new Setting(containerEl)
			.setName("Ribbon icon")
			.setDesc("Select if you want to show ribbon icon.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.ribbonIcon)
			);
	}
}
