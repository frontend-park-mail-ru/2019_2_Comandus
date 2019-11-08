// https://github.com/pcardune/handlebars-loader/tree/master/examples/helperDirs
// https://code-maven.com/handlebars-conditionals
export default function(a, b, opts) {
	return a === b ? opts.fn(this) : opts.inverse(this);
}
