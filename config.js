const hyprland = await Service.import("hyprland")
const notifications = await Service.import("notifications")
const network = await Service.import("network")
const audio = await Service.import("audio")
const battery = await Service.import("battery")
const systemtray = await Service.import("systemtray")
const bluetooth = await Service.import('bluetooth')

import { PlayerIndicator } from './Player.js';


const TIME = Variable("", {
    poll: [1000, 'date "+%H:%M:%S"'],
})

const DATE = Variable("", {
    poll: [10000, 'date "+%d/%m/%Y"'],
})



const AudioIndicator = () => Widget.Icon()
    .hook(audio.speaker, self => {
        const vol = audio.speaker.is_muted ? 0 : audio.speaker.volume

		if (vol <= 1.01 && vol >= 0.67) {
			self.icon = 'audio-volume-overamplified-symbolic'
		}
		else if (vol <= 0.66 && vol >= 0.34){
			self.icon = 'audio-volume-high-symbolic'
		}
		else if (vol <= 0.33 && vol >= 0.10){
			self.icon = 'audio-volume-medium-symbolic'
		}
		else if (vol <= 0.09 && vol >= 0.01){
			self.icon = 'audio-volume-low-symbolic'
		}
		else if (vol <= 0){
			self.icon = 'audio-volume-muted-symbolic'
		}
		else {
			self.icon = ''
		}
    })


const NetworkIndicator = () => Widget.Icon().hook(network, self => {
    const icon = network[network.primary || "wifi"]?.icon_name
    self.icon = icon || ""
    self.visible = !!icon
	})


function BluetoothIndicator() {
	const icon = bluetooth.bind('enabled').as(on =>
        `bluetooth-${on ? 'active' : 'disabled'}-symbolic`);

	return Widget.Icon({
		icon: icon
	})
}


function BatteryIndicator() {
	if (!battery.available) {
		return
	}

    const battery_level = battery.bind("percent").as(p =>
        `battery-level-${Math.floor(p / 10) * 10}-symbolic`)

	const charging = battery.bind('charging') ? 'thunderbolt-symbolic' : ''

	return Widget.Box({
		children: [
			Widget.Icon({ icon: battery_level }),
			Widget.Icon({ icon: charging })
		]
	})
}


function Workspaces() {
    const activeId = hyprland.active.workspace.bind("id")
    const workspaces = hyprland.bind("workspaces")
        .as(ws => ws.map(({ id }) => Widget.Button({
            on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
            child: Widget.Label(`${id}`),
            class_name: activeId.as(i => `${i === id ? "focused" : ""}`),
        })))

    return Widget.Box({
        class_name: "workspaces",
        children: workspaces,
    })
}


const Clock = () => Widget.Box({
	vertical: true,
	children: [
    	Widget.Label({
        	class_name: 'date',
        	label: DATE.bind(),
    	}),
    	Widget.Label({
        	class_name: 'time',
        	label: TIME.bind(),
    	})
	]
})


function Left() {
    return Widget.Box({
        spacing: 8,
		class_name: 'left',
        children: [
            // ClientTitle(),
        ],
    })
}


function Center() {
    return Widget.Box({
        spacing: 8,
		class_name: 'center',
        children: [
			Workspaces(),
        ],
    })
}


function Right() {
    return Widget.Box({
        hpack: "end",
		class_name: 'right',
        spacing: 8,
        children: [
			NetworkIndicator(),
			BluetoothIndicator(),
            BatteryIndicator(),
			AudioIndicator(),
            Clock(),
            // SysTray(),
        ],
    })
}


function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        }),
    })
}


App.config({
    style: "./style.css",
    windows: [
        Bar(0),
        Bar(1),
    ],
})


export { }
