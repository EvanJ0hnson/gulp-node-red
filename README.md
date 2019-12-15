# gulp-node-red

Build source files into Node-RED nodes

## Usage

Current version of the plugin allows to build Node-RED UI node from multiple HTML and JavaScript files into a single-file node format, required by Node-RED

### Input

```
  > src
    > <node-name>
      > ui
        > <node-name>.js
        > <node-name>.html
```

### Output

```
  > nodes
    > <node-name>
      > <node-name>.html
```

Output HTML file consists of the following sections

```javascript
<script type="text/javascript">
  …
</script>

<script type="text/x-red" data-template-name="<node-name>">
  …
</script>
```

## Planned for next releases

- [ ] Support styles (CSS)
- [ ] Use bundler for JavaScipt (Parcel)
- [ ] Provide configuration object
- [ ] Add HTML minifier
- [ ] Add CSS minifier
- [ ] Allow to use SASS or LESS
