Add the following to an app's <head> to test:

```html
<script type="text/javascript">
  window.TD_CLIENT_ID = "$CLIENT_ID";
  window.TD_DOMAINS = ["dev.example.com"];
  (function () {
    d = document;
    s = d.createElement("script");
    s.src = "$S3_URL";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>
```

`$S3_URL` can be "https://testdetector.s3.eu-west-2.amazonaws.com/main.js" or "https://testdetector-dev.s3.eu-west-2.amazonaws.com/main.js".
