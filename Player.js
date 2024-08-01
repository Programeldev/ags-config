const mpris = await Service.import('mpris')


export function PlayerIndicator() {
	const player = mpris.getPlayer()

	const artists = player.bind('track-artists').as(s => s.join(', '));
	const title = player.bind('track-title').as(
		s => s = ' - ' + s
	);

	console.log(artists.length + title.length);

	return Widget.Box({
		children: [
			Widget.Box({
				class_name: 'marquee-box',
				children: [
					Widget.Label({
						class_name: 'marquee-label',
						label: artists
					}),
					Widget.Label({
						class_name: 'marquee-label',
						label: title
					})
				]
			}),

			Widget.Button({
				child: Widget.Icon('media-skip-backward-symbolic'),
				visible: player.bind('can_go_prev'),
				onClicked: () => player.previous()
			}),

			Widget.Button({
				child: Widget.Icon({
					icon: player.bind('play_back_status').transform(
						s => {
							switch(s) {
								case 'Playing': return 'media-playback-pause-symbolic'
								case 'Paused': return 'media-playback-start-symbolic'
								case 'Stopped': return 'media-playback-start-symbolic'
							}
						}
					)
				}),
				onClicked: () => player.playPause()
			}),

			Widget.Button({
				child: Widget.Icon('media-skip-forward-symbolic'),
				visible: player.bind('can_go_next'),
				onClicked: () => player.next()
			})
		]
	})
}

// export function Media() {
// 	return
// }
