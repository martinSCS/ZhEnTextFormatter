declare function addZhEnBreaks(node: Node): void;

declare function isBlockElement(node: Node): boolean;

declare function isChinese(char: string): boolean;

declare function getLastChar(node: Node): string | null;

declare function getFirstChar(node: Node): string | null;

export default addZhEnBreaks;