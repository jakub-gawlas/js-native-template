const createParser = require('./index');

describe('parser', () => {
  describe('basic', () => {
    [
      {
        desc: 'only static text',
        src: 'foo',
        out: 'foo',
      },
      {
        desc: 'single expression',
        src: 'foo ${1 + 1}',
        out: 'foo 2',
      },
      {
        desc: 'many expressions',
        src: 'foo ${1 + 1} bar ${1 > 2 ? 10 : 20}',
        out: 'foo 2 bar 20',
      },
      {
        desc: 'many lines',
        src: '\nfoo\n${1+1}\n',
        out: '\nfoo\n2\n',
      },
      {
        desc: 'chars `',
        src: 'foo`${1+1}``bar```',
        out: 'foo`2``bar```',
      },
      {
        desc: 'single promise expression',
        src: 'foo ${(async () => 10)()}',
        out: 'foo 10',
      },
      {
        desc: 'many promise expression',
        src: 'foo ${(async () => 10)()} bar ${(async () => 20)()}',
        out: 'foo 10 bar 20',
      },
    ].forEach(({ desc, src, out }) => {
      it(desc, async () => {
        const parse = createParser();
        expect(await parse(src)).toEqual(out);
      });
    });
  });
  describe('with custom methods', () => {
    [
      {
        desc: 'single method',
        methods: {
          foo: () => 'FOOfooFOO',
        },
        src: '${foo()} bar',
        out: 'FOOfooFOO bar',
      },
      {
        desc: 'single async method',
        methods: {
          foo: async () => 'FOOfooFOO',
        },
        src: '${foo()} bar',
        out: 'FOOfooFOO bar',
      },
      {
        desc: 'many methods',
        methods: {
          foo: () => 'FOO',
          bar: async () => 'BAR',
          echo: x => x,
        },
        src: '${foo()} ${bar()} ${echo("BAZ")}',
        out: 'FOO BAR BAZ',
      },
    ].forEach(({ desc, methods, src, out }) => {
      it(desc, async () => {
        const parse = createParser(methods);
        expect(await parse(src)).toEqual(out);
      });
    });
  });
  describe('with custom factory methods', () => {
    [
      {
        desc: 'with custom args',
        methods: {
          foo: x =>
            function needArg(y) {
              return `${x} ${y}`;
            },
        },
        args: {
          needArg: 'BAR',
        },
        src: '${foo("FOO")} BAZ',
        out: 'FOO BAR BAZ',
      },
      {
        desc: 'without custom args',
        methods: {
          foo: x =>
            function notNeedArg() {
              return `${x}`;
            },
        },
        args: {},
        src: '${foo("FOO")} BAZ',
        out: 'FOO BAZ',
      },
    ].forEach(({ desc, methods, args, src, out }) => {
      it(desc, async () => {
        const parse = createParser(methods);
        expect(await parse(src, args)).toEqual(out);
      });
    });
  });
  describe('errors', () => {
    [
      {
        desc: 'single line',
        src: 'foo${bar}',
        error: 'bar is not defined at 1:6',
      },
      {
        desc: 'multi line',
        src: 'foo\n${bar}baz',
        error: 'bar is not defined at 2:3',
      },
    ].forEach(({ desc, src, error }) => {
      it(desc, async () => {
        const parse = createParser();
        expect.assertions(1);
        try {
          await parse(src);
        } catch (err) {
          expect(err.message).toEqual(error);
        }
      });
    });
  });
});
