```html
<script type="text/javascript">
  window.TD_CLIENT_ID = "$CLIENT_ID";
  window.TD_DOMAINS = ["dev.example.com"];
  (function () {
    d = document;
    s = d.createElement("script");
    s.src = "http://127.0.0.1:8081/main.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>
```
