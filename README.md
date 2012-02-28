#Coding Standards

##Model Coding Standards

* Defaults: Use null for default Id values, not empty strings

* Defaults: For collection references, use a Backbone.Collection (or subclass) instance, not a Javascript 
array instance

* Attributes: Use get/set methods to set attribute values, do not use bare instance variables


##Collection Coding Standards

* Always set a Model reference

##View Coding Standards

* On the 'render' method, return a reference to the instance, i.e. @, not @el or string content

* Prefer HTML rendering to Javascript rendering, Javascript rendering is expensive in IE