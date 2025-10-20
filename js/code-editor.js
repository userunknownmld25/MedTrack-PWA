// Advanced Code Editor with Syntax Highlighting
class CodeEditor {
    constructor() {
        this.languages = {
            javascript: {
                name: 'JavaScript',
                extensions: ['.js', '.jsx', '.mjs'],
                keywords: ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'implements', 'interface', 'type', 'enum', 'namespace', 'module', 'declare', 'public', 'private', 'protected', 'static', 'readonly', 'abstract', 'override', 'virtual', 'sealed', 'internal', 'external', 'global', 'ambient', 'reference', 'path', 'types', 'lib', 'compilerOptions', 'include', 'exclude', 'files', 'extends', 'strict', 'noImplicitAny', 'strictNullChecks', 'strictFunctionTypes', 'strictBindCallApply', 'strictPropertyInitialization', 'noImplicitReturns', 'noFallthroughCasesInSwitch', 'noUncheckedIndexedAccess', 'noImplicitOverride', 'noPropertyAccessFromIndexSignature', 'allowUnusedLabels', 'allowUnreachableCode', 'exactOptionalPropertyTypes', 'noImplicitThis', 'useUnknownInCatchVariables', 'noImplicitUseStrict', 'noStrictGenericChecks', 'suppressImplicitAnyIndexErrors', 'noUnusedLocals', 'noUnusedParameters', 'exactOptionalPropertyTypes', 'noImplicitReturns', 'noFallthroughCasesInSwitch', 'noUncheckedIndexedAccess', 'noImplicitOverride', 'noPropertyAccessFromIndexSignature', 'allowUnusedLabels', 'allowUnreachableCode', 'exactOptionalPropertyTypes', 'noImplicitThis', 'useUnknownInCatchVariables', 'noImplicitUseStrict', 'noStrictGenericChecks', 'suppressImplicitAnyIndexErrors', 'noUnusedLocals', 'noUnusedParameters'],
                operators: ['+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=', '?', ':', '??', '?.', '=>'],
                strings: ['"', "'", '`'],
                comments: ['//', '/*', '*/'],
                brackets: [['{', '}'], ['[', ']'], ['(', ')']]
            },
            python: {
                name: 'Python',
                extensions: ['.py', '.pyw', '.pyc', '.pyo', '.pyd'],
                keywords: ['and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'True', 'False', 'None'],
                operators: ['+', '-', '*', '/', '//', '%', '**', '=', '==', '!=', '<', '>', '<=', '>=', 'and', 'or', 'not', 'in', 'is', '+=', '-=', '*=', '/=', '//=', '%=', '**=', '&', '|', '^', '~', '<<', '>>', '&=', '|=', '^=', '<<=', '>>='],
                strings: ['"', "'", '"""', "'''"],
                comments: ['#'],
                brackets: [['{', '}'], ['[', ']'], ['(', ')']]
            },
            html: {
                name: 'HTML',
                extensions: ['.html', '.htm', '.xhtml'],
                keywords: ['html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'textarea', 'select', 'option', 'label', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 's', 'small', 'big', 'sub', 'sup', 'code', 'pre', 'blockquote', 'cite', 'abbr', 'acronym', 'address', 'bdo', 'kbd', 'q', 'samp', 'var', 'del', 'ins', 'dfn', 'tt', 'xmp', 'plaintext', 'listing', 'font', 'basefont', 'center', 'dir', 'isindex', 'menu', 'noframes', 'noscript', 'applet', 'object', 'param', 'embed', 'area', 'map', 'iframe', 'frame', 'frameset', 'noframes', 'col', 'colgroup', 'thead', 'tbody', 'tfoot', 'caption', 'fieldset', 'legend', 'optgroup', 'datalist', 'output', 'progress', 'meter', 'details', 'summary', 'dialog', 'menu', 'menuitem', 'command', 'keygen', 'source', 'track', 'video', 'audio', 'canvas', 'svg', 'math', 'article', 'aside', 'footer', 'header', 'main', 'nav', 'section', 'figure', 'figcaption', 'time', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'wbr', 'data', 'template', 'slot'],
                operators: ['=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=', '?', ':', '??', '?.'],
                strings: ['"', "'"],
                comments: ['<!--', '-->'],
                brackets: [['<', '>'], ['{', '}'], ['[', ']'], ['(', ')']]
            },
            css: {
                name: 'CSS',
                extensions: ['.css', '.scss', '.sass', '.less'],
                keywords: ['color', 'background', 'border', 'margin', 'padding', 'width', 'height', 'font', 'text', 'display', 'position', 'float', 'clear', 'overflow', 'visibility', 'opacity', 'z-index', 'top', 'right', 'bottom', 'left', 'flex', 'grid', 'align', 'justify', 'content', 'items', 'self', 'order', 'grow', 'shrink', 'basis', 'wrap', 'direction', 'flow', 'gap', 'row', 'column', 'area', 'template', 'auto', 'none', 'inherit', 'initial', 'unset', 'revert', 'all', 'important', 'url', 'calc', 'var', 'attr', 'counter', 'counters', 'linear-gradient', 'radial-gradient', 'conic-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient', 'repeating-conic-gradient', 'image', 'element', 'cross-fade', 'image-set', 'paint', 'ltr', 'rtl', 'static', 'relative', 'absolute', 'fixed', 'sticky', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'inline-table', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row', 'table-row-group', 'table-caption', 'list-item', 'run-in', 'compact', 'ruby', 'ruby-base', 'ruby-text', 'ruby-base-group', 'ruby-text-group', 'ruby-merge', 'ruby-merge-group', 'ruby-merge-pair', 'ruby-merge-pair-group', 'ruby-merge-pair-base', 'ruby-merge-pair-text', 'ruby-merge-pair-group', 'ruby-merge-pair-base-group', 'ruby-merge-pair-text-group', 'ruby-merge-pair-base-group', 'ruby-merge-pair-text-group'],
                operators: ['=', ':', ';', ',', '.', '#', '+', '-', '*', '/', '%', '(', ')', '[', ']', '{', '}', '<', '>', '!', '&', '|', '^', '~', '?', '@', '\\'],
                strings: ['"', "'"],
                comments: ['/*', '*/'],
                brackets: [['{', '}'], ['[', ']'], ['(', ')']]
            },
            json: {
                name: 'JSON',
                extensions: ['.json'],
                keywords: ['true', 'false', 'null'],
                operators: [':', ',', '[', ']', '{', '}'],
                strings: ['"'],
                comments: [],
                brackets: [['{', '}'], ['[', ']']]
            },
            xml: {
                name: 'XML',
                extensions: ['.xml', '.xsd', '.xsl', '.xslt'],
                keywords: ['xml', 'version', 'encoding', 'standalone', 'DOCTYPE', 'PUBLIC', 'SYSTEM', 'CDATA', 'PCDATA', 'ANY', 'EMPTY', 'ID', 'IDREF', 'IDREFS', 'NMTOKEN', 'NMTOKENS', 'ENTITY', 'ENTITIES', 'NOTATION', 'ENUMERATION', 'xs:schema', 'xs:element', 'xs:attribute', 'xs:complexType', 'xs:simpleType', 'xs:sequence', 'xs:choice', 'xs:all', 'xs:group', 'xs:attributeGroup', 'xs:restriction', 'xs:extension', 'xs:union', 'xs:list', 'xs:annotation', 'xs:documentation', 'xs:appinfo', 'xs:import', 'xs:include', 'xs:redefine', 'xs:override', 'xs:field', 'xs:key', 'xs:keyref', 'xs:unique', 'xs:selector', 'xs:any', 'xs:anyAttribute', 'xs:notation', 'xs:appinfo', 'xs:documentation', 'xs:annotation', 'xs:import', 'xs:include', 'xs:redefine', 'xs:override', 'xs:field', 'xs:key', 'xs:keyref', 'xs:unique', 'xs:selector', 'xs:any', 'xs:anyAttribute', 'xs:notation'],
                operators: ['=', ':', ';', ',', '.', '#', '+', '-', '*', '/', '%', '(', ')', '[', ']', '{', '}', '<', '>', '!', '&', '|', '^', '~', '?', '@', '\\'],
                strings: ['"', "'"],
                comments: ['<!--', '-->'],
                brackets: [['<', '>'], ['{', '}'], ['[', ']'], ['(', ')']]
            }
        };
        
        this.currentLanguage = 'javascript';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeEditors();
        });
    }

    initializeEditors() {
        const editors = document.querySelectorAll('.code-textarea');
        editors.forEach(editor => {
            this.setupEditor(editor);
        });
    }

    setupEditor(textarea) {
        // Create syntax highlighting wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-editor-wrapper';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            font-family: var(--font-mono);
            font-size: 14px;
            line-height: 1.5;
        `;

        // Create line numbers
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        lineNumbers.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 40px;
            height: 100%;
            background: #f8f8f8;
            border-right: 1px solid #ddd;
            padding: 16px 8px;
            font-size: 14px;
            line-height: 1.5;
            color: #666;
            user-select: none;
            overflow: hidden;
            z-index: 1;
        `;

        // Create syntax highlighter
        const highlighter = document.createElement('div');
        highlighter.className = 'syntax-highlighter';
        highlighter.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 16px 16px 16px 56px;
            font-family: var(--font-mono);
            font-size: 14px;
            line-height: 1.5;
            color: transparent;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: hidden;
            pointer-events: none;
            z-index: 2;
        `;

        // Style textarea
        textarea.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 16px 16px 16px 56px;
            font-family: var(--font-mono);
            font-size: 14px;
            line-height: 1.5;
            background: transparent;
            border: none;
            outline: none;
            resize: none;
            color: transparent;
            caret-color: #000;
            z-index: 3;
        `;

        // Insert wrapper
        textarea.parentNode.insertBefore(wrapper, textarea);
        wrapper.appendChild(lineNumbers);
        wrapper.appendChild(highlighter);
        wrapper.appendChild(textarea);

        // Setup event listeners
        textarea.addEventListener('input', () => {
            this.updateSyntaxHighlighting(textarea, highlighter, lineNumbers);
        });

        textarea.addEventListener('scroll', () => {
            lineNumbers.scrollTop = textarea.scrollTop;
            highlighter.scrollTop = textarea.scrollTop;
        });

        textarea.addEventListener('keydown', (e) => {
            this.handleKeyDown(e, textarea, lineNumbers);
        });

        // Initial update
        this.updateSyntaxHighlighting(textarea, highlighter, lineNumbers);
    }

    updateSyntaxHighlighting(textarea, highlighter, lineNumbers) {
        const text = textarea.value;
        const lines = text.split('\n');
        
        // Update line numbers
        lineNumbers.innerHTML = lines.map((_, index) => index + 1).join('\n');
        
        // Update syntax highlighting
        const highlightedText = this.highlightSyntax(text, this.currentLanguage);
        highlighter.innerHTML = highlightedText;
    }

    highlightSyntax(text, language) {
        const lang = this.languages[language];
        if (!lang) return this.escapeHtml(text);

        let highlighted = text;
        
        // Highlight strings
        lang.strings.forEach(quote => {
            const stringRegex = new RegExp(`(${this.escapeRegex(quote)}[^${this.escapeRegex(quote)}]*${this.escapeRegex(quote)})`, 'g');
            highlighted = highlighted.replace(stringRegex, `<span class="string">$1</span>`);
        });

        // Highlight comments
        lang.comments.forEach(comment => {
            if (comment === '//') {
                highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
            } else if (comment === '/*') {
                highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
            } else if (comment === '#') {
                highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
            } else if (comment === '<!--') {
                highlighted = highlighted.replace(/(<!--[\s\S]*?-->)/g, '<span class="comment">$1</span>');
            }
        });

        // Highlight keywords
        const keywordRegex = new RegExp(`\\b(${lang.keywords.join('|')})\\b`, 'g');
        highlighted = highlighted.replace(keywordRegex, '<span class="keyword">$1</span>');

        // Highlight operators
        const operatorRegex = new RegExp(`(${lang.operators.map(this.escapeRegex).join('|')})`, 'g');
        highlighted = highlighted.replace(operatorRegex, '<span class="operator">$1</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');

        // Highlight functions
        highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="function">$1</span>(');

        return highlighted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    handleKeyDown(e, textarea, lineNumbers) {
        // Handle Tab key
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            
            textarea.value = value.substring(0, start) + '    ' + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 4;
            
            // Trigger input event
            textarea.dispatchEvent(new Event('input'));
        }
        
        // Handle Enter key for auto-indentation
        if (e.key === 'Enter') {
            const start = textarea.selectionStart;
            const value = textarea.value;
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            const currentLine = value.substring(lineStart, start);
            const indent = currentLine.match(/^\s*/)[0];
            
            // Auto-indent based on language
            if (this.currentLanguage === 'python') {
                if (currentLine.trim().endsWith(':')) {
                    setTimeout(() => {
                        const newStart = textarea.selectionStart;
                        textarea.value = textarea.value.substring(0, newStart) + '    ' + textarea.value.substring(newStart);
                        textarea.selectionStart = textarea.selectionEnd = newStart + 4;
                        textarea.dispatchEvent(new Event('input'));
                    }, 0);
                }
            }
        }
        
        // Handle bracket completion
        if (e.key === '{' || e.key === '[' || e.key === '(') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            
            const closingBrackets = {
                '{': '}',
                '[': ']',
                '(': ')'
            };
            
            textarea.value = value.substring(0, start) + e.key + closingBrackets[e.key] + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
            textarea.dispatchEvent(new Event('input'));
        }
    }

    setLanguage(language) {
        this.currentLanguage = language;
        
        // Update all editors
        const editors = document.querySelectorAll('.code-textarea');
        editors.forEach(textarea => {
            const wrapper = textarea.closest('.code-editor-wrapper');
            if (wrapper) {
                const highlighter = wrapper.querySelector('.syntax-highlighter');
                const lineNumbers = wrapper.querySelector('.line-numbers');
                this.updateSyntaxHighlighting(textarea, highlighter, lineNumbers);
            }
        });
    }

    getLanguage() {
        return this.currentLanguage;
    }

    formatCode(text, language) {
        // Basic code formatting
        switch (language) {
            case 'javascript':
                return this.formatJavaScript(text);
            case 'python':
                return this.formatPython(text);
            case 'html':
                return this.formatHTML(text);
            case 'css':
                return this.formatCSS(text);
            case 'json':
                return this.formatJSON(text);
            default:
                return text;
        }
    }

    formatJavaScript(text) {
        // Basic JavaScript formatting
        let formatted = text;
        
        // Add spaces around operators
        formatted = formatted.replace(/([=!<>]=?|[+\-*/%&|^])/g, ' $1 ');
        
        // Add spaces after commas
        formatted = formatted.replace(/,/g, ', ');
        
        // Add spaces around brackets
        formatted = formatted.replace(/([{}[\]()])/g, ' $1 ');
        
        // Clean up multiple spaces
        formatted = formatted.replace(/\s+/g, ' ');
        
        return formatted.trim();
    }

    formatPython(text) {
        // Basic Python formatting
        let formatted = text;
        
        // Add spaces around operators
        formatted = formatted.replace(/([=!<>]=?|[+\-*/%&|^])/g, ' $1 ');
        
        // Add spaces after commas
        formatted = formatted.replace(/,/g, ', ');
        
        // Clean up multiple spaces
        formatted = formatted.replace(/\s+/g, ' ');
        
        return formatted.trim();
    }

    formatHTML(text) {
        // Basic HTML formatting
        let formatted = text;
        
        // Add line breaks after tags
        formatted = formatted.replace(/(<\/?[^>]+>)/g, '\n$1\n');
        
        // Clean up multiple line breaks
        formatted = formatted.replace(/\n\s*\n/g, '\n');
        
        return formatted.trim();
    }

    formatCSS(text) {
        // Basic CSS formatting
        let formatted = text;
        
        // Add spaces around colons
        formatted = formatted.replace(/:/g, ': ');
        
        // Add spaces around semicolons
        formatted = formatted.replace(/;/g, '; ');
        
        // Add line breaks after semicolons
        formatted = formatted.replace(/;/g, ';\n');
        
        // Clean up multiple spaces
        formatted = formatted.replace(/\s+/g, ' ');
        
        return formatted.trim();
    }

    formatJSON(text) {
        try {
            const parsed = JSON.parse(text);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return text;
        }
    }

    minifyCode(text, language) {
        switch (language) {
            case 'javascript':
                return this.minifyJavaScript(text);
            case 'css':
                return this.minifyCSS(text);
            case 'html':
                return this.minifyHTML(text);
            case 'json':
                return this.minifyJSON(text);
            default:
                return text;
        }
    }

    minifyJavaScript(text) {
        // Basic JavaScript minification
        return text
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([{}[\]();,=+\-*/%&|^<>!?:])\s*/g, '$1') // Remove spaces around operators
            .trim();
    }

    minifyCSS(text) {
        // Basic CSS minification
        return text
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([{}:;,=+\-*/%&|^<>!?])\s*/g, '$1') // Remove spaces around operators
            .trim();
    }

    minifyHTML(text) {
        // Basic HTML minification
        return text
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/>\s+</g, '><') // Remove spaces between tags
            .trim();
    }

    minifyJSON(text) {
        try {
            const parsed = JSON.parse(text);
            return JSON.stringify(parsed);
        } catch (e) {
            return text;
        }
    }
}

// Initialize code editor
window.codeEditor = new CodeEditor();