HTMLWidgets.widget({

  name: 'rbokeh',

  type: 'output',

  initialize: function(el, width, height) {
    return {
      modelid: "",
      elementid: "",
      width: width,
      height: height
    };
  },

  renderValue: function(el, x, instance) {

    //clear el for Shiny/dynamic contexts
    el.innerHTML = "";

    if(x.isJSON === true) {
      x.docs_json = JSON.parse(x.docs_json);
    }

    var refkey = Object.keys(x.docs_json)[0];
    var refs = x.docs_json[refkey].roots.references;

    instance.modelid = x.modelid;
    instance.elementid = x.elementid;

    if(x.debug === true) {
      console.log(refs);
      console.log(JSON.stringify(refs));
    }

    // change "nulls" in data to NaN
    function traverseObject(obj) {
      for(var key in obj) {
        if(obj[key].constructor === Object) {
          traverseObject(obj[key]);
        } else if(obj[key].constructor === Array) {
          for (var i = 0; i < obj[key].length; i++) {
            if(obj[key][i] === null)
              obj[key][i] = NaN;
          }
        }
      }
    }
    for(var i = 0; i < refs.length; i++) {
      if(refs[i].type === "ColumnDataSource")
        traverseObject(refs[i].attributes.data);
    }

    var dv1 = document.createElement('div');
    dv1.setAttribute("class", "bk-root");
    var dv = document.createElement('div');
    dv.id = x.elementid;
    dv.setAttribute("class", "plotdiv");
    dv1.appendChild(dv);
    el.appendChild(dv1);

    var render_items = [{
      "docid": x.docid,
      "elementid": x.elementid,
      "modelid": x.modelid
    }];

    if(x.debug !== true) {
      Bokeh.set_log_level('info');
    }

    Bokeh.embed.embed_items(x.docs_json, render_items);
  },

  resize: function(el, width, height, instance) {
  }
});

