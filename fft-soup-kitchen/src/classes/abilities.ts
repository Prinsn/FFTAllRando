export interface Ability
{
    Name: string;
    //public string PspName { get; set; }
    Job: string;
    //public string PspJob { get; set; }
    JP: number;
    ToString(): string;
}

export interface SupportAbility extends Ability {
    ReactionType: string;    
}

export function AbilityToString(ability: Ability) {
    var type = AbilityToType(ability);
    return `${ability.Name} (${ability.Job}, ${type})`;
}

export function AbilityToType(ability: Ability){
    var reactionType = (ability as SupportAbility).ReactionType;
    if(reactionType){
        var type = reactionType;
        if(type.indexOf("reaction") > -1){
            type = "reaction";
        }

        return type.charAt(0).toUpperCase() + type.slice(1);                
    }
    
    return "Active";
}

export interface ActiveAbility extends Ability {
    Type: string;
    CounterGrasp: boolean;
    MP: number;
    Reflect: boolean;
    CounterMagic: boolean;
    ChargeTicks: number;
    MathMagic: true;
    CounterFlood: boolean;
    Element: string;
    Evadable: boolean;
    DamageCalc_MOD: number;
    Range_Auto: boolean;
    Range_4Directions: boolean;
    Range_Linear: boolean;
    Range_Horizontal: number;
    Range_Vertical: number;
    Range_Weapon: boolean;
    Range_CasterImmune: boolean;
    Effect_Horizontal: number;
    Effect_Veritcal: number;
    Effect_AllAllies: boolean;
    Effect_AllEnemies: boolean;
    EffecT_EnemyOnly: boolean;
    Effect_AllyOnly: boolean;
    Effect_CasterImmune: boolean;
    Effect_Linear: boolean;
    LineOfSight: boolean;
    SpecialConsiderationType: 0;
    Name: string;
    Job: string;
    JP: number;
}