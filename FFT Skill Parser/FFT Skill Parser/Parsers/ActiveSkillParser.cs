using FFT_Skill_Parser.Classes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace FFT_Skill_Parser
{
    static class ActiveSkillParser
    {
        public static void Parse(string path)
        {
            var activeFileName = "Active Skills.txt";
            var itemFileName = "Active Skills, Items.txt";

            var actives = new List<object>();

            var activeFile = File.ReadAllText(Path.Join(path, activeFileName).ToString());
            var splitActive = activeFile.Split("_____________________________________________________________________________");
            foreach(var blob in splitActive)
            {
                actives.Add(new ActiveAbility(blob));
            }

            var itemFile = File.ReadAllText(Path.Join(path, itemFileName).ToString());
            foreach(var row in itemFile.Split(Environment.NewLine))
            {
                actives.Add(ActiveAbility.MakeItem(row));
            }

            actives.AddRange(ActiveAbility.GetJumps());
            actives.AddRange(ActiveAbility.GetCharges());
            actives.AddRange(ActiveAbility.GetMathSkills());


            File.WriteAllText(path + "\\active.json", JsonSerializer.Serialize(actives, new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            }));
        }
    }
}
