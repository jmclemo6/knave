/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class KnaveItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;

    if(itemData.type === "weaponRanged")
    {
      if(data.ammo.value > data.ammo.max)
        data.ammo.value = data.ammo.max;
      else if(data.ammo.value < data.ammo.min)
        data.ammo.value = data.ammo.min;
    }
  }

  _breakItem() {
    this.update({'data.broken': true});

    if (actorData) {
      const lastLetterOfName = actorData.name.slice(-1);
      const msg = `${lastLetterOfName == 's' ? "'" : "'s"} ${itemData.name} broke`;
      ChatMessage.create(
      {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: msg,
      });
    }
  }
}
