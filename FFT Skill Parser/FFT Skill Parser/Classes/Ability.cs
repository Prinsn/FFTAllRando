using System;
using System.Collections.Generic;
using System.Text;

namespace FFT_Skill_Parser.Classes
{
    class Ability
    {        
        public string Name { get; set; }
        //public string PspName { get; set; }
        public string Job { get; set; }
        //public string PspJob { get; set; }
        public int? JP { get; set; }
        //public int? PspJp { get; set; } 

        public Ability() { }
        public Ability(string row, bool itemSkill)
        {
            var start = row.IndexOf("[") + 1;
            var end = row.IndexOf("]", start);
            Name = row[start..end];

            var jpJobSplit = row.Split("]")[1].Split('-')[1].Split(',');
            JP = int.Parse(jpJobSplit[0].Replace("JP", ""));
            if (itemSkill)
            {
                Job = "Chemist";
            }
            else
            {
                Job = jpJobSplit[1].Trim();
            }
        }        
    }
}