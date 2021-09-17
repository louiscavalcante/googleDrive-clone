import { describe, test, expect, jest, beforeAll, afterAll } from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'
import Routes from '../../src/routes.js'
import FormData from 'form-data'
import TestUtil from '../_util/testUtil.js'
import { logger } from '../../src/logger.js'
import { tmpdir } from 'os'
import { join } from 'path'

describe('#Routes Integration Test', () => {
	let defaultDownloadsFolder = process.env.TMP
	beforeAll(async () => {
		defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
	})

	afterAll(async () => {
		await fs.promises.rm(defaultDownloadsFolder, { recursive: true })
	})

	beforeEach(() => {
		jest.spyOn(logger, 'info').mockImplementation()
	})

	describe('#getFileStatus', () => {
		const ioObj = {
			to: id => ioObj,
			emit: (event, message) => {},
		}

		test('should upload file to the folder', async () => {
			const filename = 'mocksTest.jpg'
			const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
			const response = TestUtil.generateWritableStream(() => {})

			const form = new FormData()
			form.append('photo', fileStream)

			const defaultParams = {
				request: Object.assign(form, {
					headers: form.getHeaders(),
					method: 'POST',
					url: '?socketId=10',
				}),
				response: Object.assign(response, {
					setHeader: jest.fn(),
					writeHead: jest.fn(),
					end: jest.fn(),
				}),
				values: () => Object.values(defaultParams),
			}

			const routes = new Routes(defaultDownloadsFolder)
			routes.setSocketInstance(ioObj)
			const dirBeforeRun = await fs.promises.readdir(defaultDownloadsFolder)
			expect(dirBeforeRun).toEqual([])
			await routes.handler(...defaultParams.values())
			const dirAfterRun = await fs.promises.readdir(defaultDownloadsFolder)
			expect(dirAfterRun).toEqual([filename])
		})
	})
})
