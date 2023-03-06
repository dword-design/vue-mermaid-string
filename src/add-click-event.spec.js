import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'

import self from './add-click-event.js'

export default tester(
  {
    'multiple chars': {
      result: endent`
        graph TD
          click AA mermaidClick_<id>
      `,
      subject: endent`
        graph TD
          click AA
      `,
    },
    works: {
      result: endent`
        graph TD
          click A mermaidClick_<id>
      `,
      subject: endent`
        graph TD
          click A
      `,
    },
  },
  [
    {
      transform: test => () =>
        expect(self(test.subject, { id: '<id>' })).toEqual(test.result),
    },
  ],
)
