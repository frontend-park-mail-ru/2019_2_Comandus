// https://github.com/pcardune/handlebars-loader/tree/master/examples/helperDirs
// https://code-maven.com/handlebars-conditionals
export default function(a, b, opts) {
	if (a === b) {
		return opts.fn(this);
	}
	return opts.inverse(this);
}
