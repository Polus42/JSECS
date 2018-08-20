// Core ////////////////////////////////////////////////////////////////////////////////////
var Entity = class
{
    constructor(archetype)
    {
        // Generate a pseudo random ID
        this.id = Entity.prototype.Count;
        // increment counter
        Entity.prototype.Count++;
        // The component data will live in this object
        this.components = {};
        if(archetype!=undefined)
        for (let i = 0; i < archetype.length; i++) {
            this.addComponent(new Component({}, archetype[i]));
        }
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
// Tests ////////////////////////////////////////////////////////////////////////////////////
    let drawSystem = new System(e=>{
        console.log("Drawing : "+e.id)
    
    },["size"]);
setInterval(e=>{ update()},33);
let e = new Entity();
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