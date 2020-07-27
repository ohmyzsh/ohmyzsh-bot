import { promises as fs } from 'fs'
import { parseModifiedFiles, parseCodeOwners, CodeOwner } from '../src/actions/assign'
import modifiedFilesResponse from '../test/fixtures/modifiedFiles.json'

describe('assigning PR reviewers', () => {
  test('correctly parses modified files', async () => {
    const expectedModifiedFiles = ['plugins/gitfast/update']
    const modifiedFiles = await parseModifiedFiles(modifiedFilesResponse)

    expect(modifiedFiles.sort()).toEqual(expectedModifiedFiles.sort())
  })

  test('correctly parses CODEOWNERS file', async () => {
    const expectedCodeOwners: CodeOwner[] = [
      {
        path: 'plugins/gitfast/',
        username: 'felipec'
      },
      {
        path: 'plugins/sdk/',
        username: 'rgoldberg'
      }
    ]

    const codeOwnersFile = await fs.readFile('./test/fixtures/CODEOWNERS')
    const codeOwners = await parseCodeOwners(codeOwnersFile.toString())

    expect(codeOwners.sort()).toEqual(expectedCodeOwners.sort())
  })
})
