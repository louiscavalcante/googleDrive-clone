import { describe, test, expect, jest } from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'
import Routes from '../../src/routes.js'

describe('#FileHelper', () => {
	describe('#getFileStatus', () => {
		test('it should return files statuses on correct format', async () => {
			const statMock = {
				dev: 608496995,
				mode: 33206,
				nlink: 1,
				uid: 0,
				gid: 0,
				rdev: 0,
				blksize: 4096,
				ino: 3096224743939611,
				size: 337434,
				blocks: 664,
				atimeMs: 1631559153149.4175,
				mtimeMs: 1631559127975.0808,
				ctimeMs: 1631559161072.2449,
				birthtimeMs: 1631545599866.7466,
				atime: '2021-09-13T18:52:33.149Z',
				mtime: '2021-09-13T18:52:07.975Z',
				ctime: '2021-09-13T18:52:41.072Z',
				birthtime: '2021-09-13T15:06:39.867Z',
			}

			const mockUser = 'Anniballi'
			process.env.USERNAME = mockUser
			const filename = 'file.png'
            const tmp = process.env.TMP

			jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValue([filename])

			jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValue(statMock)

			const result = await FileHelper.getFilesStatus(`${tmp}`)

			const expectedResult = [
				{
					size: '337 kB',
					lastModified: statMock.birthtime,
					owner: mockUser,
					file: filename,
				},
			]

			expect(fs.promises.stat).toHaveBeenCalledWith(`${tmp}\\${filename}`)
			expect(result).toMatchObject(expectedResult)
		})
	})
})
