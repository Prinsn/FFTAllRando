using System;
using System.Collections.Generic;
using System.Text;

namespace FFT_Skill_Parser.Classes
{
    enum SupportType
    {
        reaction_pseudo = 0,
        reaction_damage_trigger = 1,
        reaction_counter_grasp = 2,
        reaction_critical_status = 3,
        reaction_other = 4,
        support = 5,
        movement = 6,        
    }

    class SupportAbility : Ability
    {
        public string ReactionType { get; set; }
        public SupportAbility(string row, SupportType type) : base(row, false)
        {
            ReactionType = type.ToString();
        }
    }
}
