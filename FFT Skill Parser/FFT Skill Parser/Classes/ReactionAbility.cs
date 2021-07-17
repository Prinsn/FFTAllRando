using System;
using System.Collections.Generic;
using System.Text;

namespace FFT_Skill_Parser.Classes
{
    enum ReactionGroup
    {
        pseudo = 0,
        damage_trigger = 1,
        counter_grasp = 2,
        critical_status = 3,
        other = 4
    }
    class ReactionAbility : Ability
    {
        public string ReactionType { get; set; }
        public ReactionAbility(string row, ReactionGroup type) : base(row, false)
        {
            ReactionType = type.ToString();
        }
    }
}
