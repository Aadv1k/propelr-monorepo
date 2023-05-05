import * as draco from 'dracoql';

export function validateDracoSyntax(syntax: string): boolean {
  try {
    const lexer = new draco.lexer(syntax);
    const parser = new draco.parser(lexer.lex());
    const AST = parser.parse();
    return true;
  } catch {
    return false;
  }
}

export function runDracoQueryAndGetVar(
  query: string,
  vars: Array<string>,
): Promise<Array<string>> | undefined {
  return new Promise(async (resolve, reject) => {
    try {
      const lexer = new draco.lexer(query);
      const parser = new draco.parser(lexer.lex());
      const AST = parser.parse();
      const interpreter = new draco.interpreter(AST);
      await interpreter.run();
      resolve(vars.map((e) => interpreter.getVar(e)));
    } catch (err) {
      reject(err);
    }
  });
}
