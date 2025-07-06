# Flash.js

This is a micro library that does Turbo-like things. Opt in by adding
`data-flash` to otherwise perfectly normal links and forms:

```html
<a data-flash href="/new-page">CLick me!</a>

<form data-flash method="post" action="create.php">
  <!-- ... -->
</form>
```

Now Flash will intercept clicks and submissions! It will then submit the request
itself (respecting the URL obviously, and the method and payload for forms) and
process the response.

The response should be plain HTML and contain one or more templates, like this:

```html
<template flash-target="some-valid-dom-id" flash-action="append">
  <div>New content!</div>
</template>
```

Every template with a valid `flash-target` attribute will be processed according
to `flash-action`:

- `append` and `prepend`: the contents of the template will be appended or
  prepended _inside_ the existing `flash-target` element
- `replace`: the `flash-target` element will be removed from the DOM, and the
  template contents be added in its place
- `update`: the _contents_ of `flash-target` will be replaced, but the element
  itself will not be touched

Removing an element is not explicitly possible, but can be easily accomplished
by an empty replace:

```html
<template flash-target="some-valid-dom-id" flash-action="replace"> </template>
```

### Other options

Forms and links:

- `data-flash-confirm`: if present, will be shown through a plain alert before
  proceeding, and lets you abort the click/submission

Links only:

- `data-flash-method`: if present, replaces the default `GET` method used for
  link requests

### That's it!
