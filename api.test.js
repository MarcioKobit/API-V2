import { describe, before, after, it } from 'node:test'

describe('Api Workflow', () => {
	console.log('aqui')
	let _server = {};
	before(async () => {
		_server = (await import('./src/server.js')).app
		console.log(_server)
		await new Promise(resolve => _server.once('listening', resolve))
	})
	after(done => _server.close(done));
})
