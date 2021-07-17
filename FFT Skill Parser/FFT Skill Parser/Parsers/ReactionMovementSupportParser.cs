using FFT_Skill_Parser.Classes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;

namespace FFT_Skill_Parser
{
    class ReactionMovementSupportParser
    {
        public static void Parse(string path)
        {
            var passiveFileName = "Reaction and Movement Support Skills.txt";

            var passives = new List<object>();

            var passiveFile = File.ReadAllText(Path.Join(path, passiveFileName).ToString());

            var splitReactionAndNot = passiveFile.Split("[4.2] support abilities");

            var reactions = splitReactionAndNot[0];
            var purePassives = splitReactionAndNot[1];


            var pseudoStr = "PSEUDO-SUPPORT ABILITIES:";
            var pseudoPos = reactions.IndexOf(pseudoStr);
            var damageStr = "DAMAGE-TRIGGERED ABILTIES:";
            var damagePos = reactions.IndexOf(damageStr);
            var counterGraspStr = "COUNTERGRASP:";
            var counterGraspPos = reactions.IndexOf(counterGraspStr);
            var criticalStr = "ABILITIES ACTIVATED WHEN IN CRITICAL STATUS:";
            var criticalPos = reactions.IndexOf(criticalStr);
            var otherStr = "OTHER REACTION ABILITIES:";
            var otherPos = reactions.IndexOf(otherStr);

            var typeSorter = new[] {
                (pseudoPos, ReactionGroup.pseudo),
                (damagePos, ReactionGroup.damage_trigger),
                (counterGraspPos, ReactionGroup.counter_grasp),
                (criticalPos, ReactionGroup.critical_status),
                (otherPos, ReactionGroup.other),
            }.Reverse().ToArray();

            IEnumerable<string> getPassiveDefinitionRows(string source){
                return source.Split(Environment.NewLine)
                .Where(z => {
                    var trimmed = z.Trim();
                    return trimmed.StartsWith("[")
                    && !trimmed.StartsWith("[(")
                    && !trimmed.Contains(".");
                });
            }

            foreach (var reaction in getPassiveDefinitionRows(reactions))
            {                
                var row = reaction.Substring(0);
                var type = typeSorter.First(z => z.Item1 < reactions.IndexOf(reaction)).Item2;
                passives.Add(new ReactionAbility(row, type));
            }
            
            foreach (var passive in getPassiveDefinitionRows(purePassives))
            {                
                var row = passive.Substring(0);                
                passives.Add(new Ability(row, false));
            }

            File.WriteAllText(path + "\\passive.json", JsonSerializer.Serialize(passives, new JsonSerializerOptions
            {
                WriteIndented = true
            }));
        }
    }
}
