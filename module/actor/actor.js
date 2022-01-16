/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class KnaveActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) 
  {
    const data = actorData.data;

    //calculate armor bonus
    // Default armor (when not wearing any) is 11
    data.armor.bonus = 1

    //clamp health
    if(data.health.value > data.health.max)
      data.health.value = data.health.max;
    
    data.inventorySlots.value = Number(data.abilities.con.value) + Number(10);
    data.injuries.max = data.inventorySlots.value;

    let used = 0;
    for(let i of actorData.items)
    {
      //calculate max inventory slots and used slots
      const slots = String(i.data.data.slots);
      const divisionSignIndex = slots.indexOf('/');
      if (divisionSignIndex != -1) {
        const numerator = slots.slice(0, divisionSignIndex);
        const denominator = slots.slice(divisionSignIndex + 1);
        if (denominator === 0) {
          continue;
        }
        used += Number(numerator) / Number(denominator);
      } else {
        used += Number(i.data.data.slots);
      }
      //check if actor can use spell based on level
      if(i.type === "spell") {
        const spell_type = i.data.data.type;
        if(spell_type === "arcane") {
          i.data.data.spellUsable = (Number(actorData.data.abilities.int.value) >= Number(i.data.data.level))
        } else if(spell_type === "miracle") {
          i.data.data.spellUsable = (Number(actorData.data.abilities.wis.value) >= Number(i.data.data.level))
        }
      }

      if(i.type === "armor")
        data.armor.bonus += Number(i.data.data.AP)
    }
    data.inventorySlots.used = used;
    data.armor.value = data.armor.bonus + 10;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) 
    {      
      ability.defense = Math.floor((ability.value + 10));      
    }
  }

}