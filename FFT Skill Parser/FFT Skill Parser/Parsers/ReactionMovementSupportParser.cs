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

            var pseudoPos = reactions.IndexOf("PSEUDO-SUPPORT ABILITIES:");
            var damagePos = reactions.IndexOf("DAMAGE-TRIGGERED ABILTIES:");            
            var counterGraspPos = reactions.IndexOf("COUNTERGRASP:");
            var criticalPos = reactions.IndexOf("ABILITIES ACTIVATED WHEN IN CRITICAL STATUS:");
            var otherPos = reactions.IndexOf("OTHER REACTION ABILITIES:");            

            var typeSorter = new[] {
                (pseudoPos, SupportType.reaction_pseudo),
                (damagePos, SupportType.reaction_damage_trigger),
                (counterGraspPos, SupportType.reaction_counter_grasp),
                (criticalPos, SupportType.reaction_critical_status),
                (otherPos, SupportType.reaction_other),
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
                var type = typeSorter.First(z => z.Item1 < reactions.IndexOf(reaction)).Item2;
                passives.Add(new SupportAbility(reaction, type));
            }


            var supportPos = purePassives.IndexOf("Unlike most reaction abilities, support abilities are always active while ");
            var movementPos = purePassives.IndexOf("[4.3] movement abilities");

            typeSorter = new[]
            {
                (supportPos, SupportType.support),
                (movementPos, SupportType.movement)
            }.Reverse().ToArray();

            foreach (var passive in getPassiveDefinitionRows(purePassives))
            {
                var upper = passive.ToUpper();
                if (upper.Contains("GAMESHARK") || upper.Contains("INHERENT"))
                    continue;

                var type = typeSorter.First(z => z.Item1 < purePassives.IndexOf(passive)).Item2;
                passives.Add(new SupportAbility(passive, type));
            }

            File.WriteAllText(path + "\\passive.json", JsonSerializer.Serialize(passives, new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            }));
        }
    }
}
