(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c476a6ca"],{"3e3e":function(t,e,r){"use strict";r.r(e);var c=function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.currentArticle?r("div",{staticClass:"edit-form"},[r("h4",[t._v("Article")]),r("form",[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:"title"}},[t._v("Titre")]),r("input",{directives:[{name:"model",rawName:"v-model",value:t.currentArticle.title,expression:"currentArticle.title"}],staticClass:"form-control",attrs:{type:"text",id:"title"},domProps:{value:t.currentArticle.title},on:{input:function(e){e.target.composing||t.$set(t.currentArticle,"title",e.target.value)}}})]),r("div",{staticClass:"form-group"},[r("label",{attrs:{for:"price"}},[t._v("prix")]),r("input",{directives:[{name:"model",rawName:"v-model",value:t.currentArticle.price,expression:"currentArticle.price"}],staticClass:"form-control",attrs:{type:"text",id:"price"},domProps:{value:t.currentArticle.price},on:{input:function(e){e.target.composing||t.$set(t.currentArticle,"price",e.target.value)}}})]),r("div",{staticClass:"form-group"},[r("label",{attrs:{for:"description"}},[t._v("Description")]),r("input",{directives:[{name:"model",rawName:"v-model",value:t.currentArticle.description,expression:"currentArticle.description"}],staticClass:"form-control",attrs:{type:"text",id:"description"},domProps:{value:t.currentArticle.description},on:{input:function(e){e.target.composing||t.$set(t.currentArticle,"description",e.target.value)}}})])]),r("button",{staticClass:"badge badge-danger mr-2",on:{click:t.deleteArticle}},[t._v(" Delete ")]),r("button",{staticClass:"badge badge-success",attrs:{type:"submit"},on:{click:t.updateArticle}},[t._v(" Update ")]),r("p",[t._v(t._s(t.message))])]):r("div",[r("br"),r("p",[t._v("Please click on a Article...")])])},i=[],n=r("cd2a"),a={name:"article",data:function(){return{currentArticle:null,message:""}},methods:{getArticle:function(t){var e=this;n["a"].get(t).then((function(t){e.currentArticle=t.data,console.log(t.data)})).catch((function(t){console.log(t)}))},updateArticle:function(){var t=this;n["a"].update(this.currentArticle.id,this.currentArticle).then((function(e){console.log(e.data),t.message="The article was updated successfully!"})).catch((function(t){console.log(t)}))},deleteArticle:function(){var t=this;n["a"].delete(this.currentArticle.id).then((function(e){console.log(e.data),t.$router.push({name:"article"})})).catch((function(t){console.log(t)}))}},mounted:function(){this.message="",this.getArticle(this.$route.params.id)}},l=a,o=(r("7703"),r("2877")),s=Object(o["a"])(l,c,i,!1,null,null,null);e["default"]=s.exports},7703:function(t,e,r){"use strict";r("e6ad")},cd2a:function(t,e,r){"use strict";var c=r("d4ec"),i=r("bee2"),n=r("bc3a"),a=r.n(n),l="http://localhost:8080/api",o=function(){function t(){Object(c["a"])(this,t)}return Object(i["a"])(t,[{key:"getAll",value:function(){return a.a.get(l+"/articles")}},{key:"get",value:function(t){return a.a.get(l+"/articles/".concat(t))}},{key:"create",value:function(t){return a.a.post(l+"/add",t)}},{key:"update",value:function(t,e){return a.a.put(l+"/articles/".concat(t),e)}},{key:"delete",value:function(t){return a.a.delete(l+"/articles/".concat(t))}},{key:"deleteAll",value:function(){return a.a.delete(l+"/articles")}},{key:"findByTitle",value:function(t){return a.a.get(l+"/articles?title=".concat(t))}}]),t}();e["a"]=new o},e6ad:function(t,e,r){}}]);
//# sourceMappingURL=chunk-c476a6ca.53c76b1c.js.map