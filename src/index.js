// Core ////////////////////////////////////////////////////////////////////////////////////
var Entity = class
{
    constructor()
    {
        // Generate a pseudo random ID
        this.id = Entity.prototype.Count;
        // increment counter
        Entity.prototype.Count++;
        // The component data will live in this object
        this.components = {};
    }
    addComponent ( component ){
        // Add component data to the entity
        // NOTE: The component must have a name property (which is defined as 
        // a prototype protoype of a component function)
        if(!this.components[component.name]!=undefined)
        {
            this.components[component.name] = component;
                  for (let i = 0; i < System.AllSystems.length; i++) {
                      const element = System.AllSystems[i];
                      if(element.CanAdd(this))
                      {
                          element.subscribedEntities.push(this);
                      }
                  }
        }
    }
    removeComponent ( componentName ){
        // Remove component data by removing the reference to it.
        // Allows either a component function or a string of a component name to be
        // passed in
        var name = componentName; // assume a string was passed in
        if(typeof componentName === 'function'){ 
            // get the name from the prototype of the passed component function
            name = componentName.prototype.name;
        }
        for (let i = 0; i < System.AllSystems.length; i++) {
            const element = System.AllSystems[i];
            if(element.CanAdd(this))
            {
                element.subscribedEntities.splice(element.subscribedEntities.indexOf(this),1);
            }
        }
        // Remove component data by removing the reference to it
        delete this.components[name];
        return this;
    }
    print () {
        // Function to print / log information about the entity
        console.log(JSON.stringify(this, null, 4));
        return this;
    }
}
// keep track of entities created
Entity.prototype.Count = 0;


// Components ////////////////////////////////////////////////////////////////////////////////////
var Component = class {
    constructor(value,name)
    {
        this.value = value;
        this.name = name;
        return this;
    }
}
// Systems ////////////////////////////////////////////////////////////////////////////////////
var System = class {
    constructor(func,requireList)
    {
        this.subscribedEntities = [];
        this.dependencies = requireList;
        this.function = func;
        System.AllSystems.push(this);
    }
    Execute()
    {
        for (let i = 0; i < this.subscribedEntities.length; i++) {
            const element = this.function(this.subscribedEntities[i]);
        }
    }
    CanAdd(entity) {
        return this.dependencies.every((val) => entity.components[val]!=undefined);
    }
}
System.AllSystems = [];
System.UpdateAll = ()=>System.AllSystems.every((val)=>val.Execute());
let drawSystem = new System(e=>{e.components["size"].value*=2},["size"]);
// Tests ////////////////////////////////////////////////////////////////////////////////////
x=a.getContext`2d`;
x.fillStyle = 'rgb(200,0,0)';
x.fillRect(10,10,50,50);
var lastLoop = new Date;
setInterval(e=>{ update();
    for (let index = 0; index < 100; index++) {
        let ent  = new Entity();
        ent.addComponent(new Component(20,"size"));
    }
    console.log(e2.components["size"]);
var thisLoop = new Date;
var fps = 1000 / (thisLoop - lastLoop);
console.log(fps + "  //  "+Entity.prototype.Count);
lastLoop = thisLoop;
},33);
let e = new Entity();
let e2 = new Entity();
e.addComponent(new Component(10,"size"));
function update() {
    System.UpdateAll();
}
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        e.removeComponent("size");
        e.addComponent(new Component(1.0,"bounds"));
    }
    else if(event.keyCode == 39) {
        e2.addComponent(new Component(Math.random(),"size"));
    }
});