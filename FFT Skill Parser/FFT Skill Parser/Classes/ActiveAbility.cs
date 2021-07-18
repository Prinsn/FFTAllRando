using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FFT_Skill_Parser.Classes
{
    public enum SpecialJobOptions
    {
        Item = 0,
        Charge = 1,
        Jump = 2,
        Guts = 3
    }

    class ActiveAbility : Ability
    {
        /*
[Cure]                         [ 001 ]                          WHITE MAGIC |
|=============================================================================|
| magical  | CBG: - |  MP:   6   | Restore [CFa/100 * TFa/100 * MA * 14] HP   |
| REFL: +  |  CM: - | CTR:   4   | If target is Undead, HP is subtracted      |
| CALC: +  |  CF: - |  JP:  50   | instead of added.                          |
| ELEM: -  | EVD: - | MOD:   5   | Ignores Shell and Magic DefendUP.          |
|--------------------------------|                                            |
| Range: 4 / Effect: 2v1         |                          
        */
        public string Type { get; set; }
        public bool CounterGrasp { get; set; }
        public int MP { get; set; }
        public bool Reflect { get; set; }
        public bool CounterMagic { get; set; }
        public int ChargeTicks { get; set; }
        public bool MathMagic { get; set; }
        public bool CounterFlood { get; set; }
        public string Element { get; set; }
        public bool Evadable { get; set; }
        public string DamageCalc_MOD { get; set; }
        public bool Range_Auto { get; set; }
        public bool Range_4Directions { get; set; }
        public bool Range_Linear { get; set; }
        public int? Range_Horizontal { get; set; }
        public int? Range_Vertical { get; set; }
        public bool Range_Weapon { get; set; }
        public bool Range_CasterImmune { get; set; }
        public int Effect_Horizontal { get; set; }
        public int? Effect_Veritcal { get; set; }
        public bool Effect_AllAllies { get; set; }
        public bool Effect_AllEnemies { get; set; }
        public bool EffecT_EnemyOnly { get; set; }
        public bool Effect_AllyOnly { get; set; }
        public bool Effect_CasterImmune { get; set; }
        public bool Effect_Linear { get; set; }
        public bool LineOfSight { get; set; }
        //public int BMG_Number { get; set; }
        public SpecialJobOptions SpecialConsiderationType { get; set; }

        public static ActiveAbility MakeItem(string chemistData)
        {
            return new ActiveAbility(chemistData, null)
            {
                LineOfSight = true,
                Range_Horizontal = 4,
                Effect_Horizontal = 1,
                SpecialConsiderationType = SpecialJobOptions.Guts,
            };
        }

        public static IEnumerable<ActiveAbility> GetCharges()
        {
            return new[] { 1, 2, 3, 4, 5, 7, 10, 20 }
            .Select(c => MakeCharge(c));
        }

        public static IEnumerable<ActiveAbility> GetJumps()
        {            
            return new [] {
                (2 , false, 150),
                (3 , false, 300),
                (4 , false, 450),
                (5 , false, 600),
                (8 , false, 900),

                (2 , true, 100),
                (3 , true, 200),
                (4 , true, 300),
                (5 , true, 400),
                (6 , true, 500),
                (7 , true, 600),
                (8 , true, 900)
            }.Select(j => MakeJump(j.Item1, j.Item2, j.Item3));
        }

        private static ActiveAbility MakeCharge(int number)
        {
            return new ActiveAbility
            {
                Job = "Archer",
                Name = $"Charge +{number}",                
                Range_Weapon = true,
                Effect_Horizontal = 1,
                Type = "neutral",
                CounterFlood = true,
                CounterGrasp = true,
                SpecialConsiderationType = SpecialJobOptions.Charge,
                ChargeTicks = number switch
                {
                    1 => 4,
                    2 => 5,
                    3 => 6,
                    4 => 8,
                    5 => 10,
                    7 => 14,
                    10 => 20,
                    20 => 35,
                    _ => throw new NotImplementedException("Invalid value")
                },
                JP = number switch
                {
                    1 => 100,
                    2 => 150,
                    3 => 200,
                    4 => 250,
                    5 => 300,
                    7 => 400,
                    10 => 600,
                    20 => 1000,
                    _ => throw new NotImplementedException("Invalid value")
                }
            };
        }

        private static ActiveAbility MakeJump(int number, bool vertical, int jp)
        {
            var name = vertical ? "Vertical" : "Level";
            return new ActiveAbility
            {
                Job = "Lancer",
                Name = $"{name} Jump{number}",
                JP = jp,
                Range_Vertical = vertical ? number : (int?)null,
                Range_Horizontal = vertical ? (int?)null : number,
                Effect_Horizontal = 1,
                ChargeTicks = 0,
                Type = "neutral",
                CounterFlood = true,
                CounterGrasp = true
            };
        }

        private ActiveAbility() { }
        private ActiveAbility(string standardRow, object? emptyConstructorArg) : base (standardRow, true) { }

        public ActiveAbility(string dataBlob)
        {
            var topRow = dataBlob
                .Split("|")[1];

            SetFirstRow(topRow);
            SetAllElse(dataBlob);
        }

        private void SetAllElse(string row)
        {
            var start = row.IndexOf("=|") + 2;
            start = row.IndexOf("| ", start) + 2;
            var end = row.IndexOf(" |", start) - 1;
            Type = row[start..end].Trim();

            var cbg = "CBG: ";
            start = row.IndexOf(cbg) + cbg.Length;
            CounterGrasp = row[start] == '+';

            var mp = "MP:";
            start = row.IndexOf(mp) + mp.Length;
            end = row.IndexOf(" |", start) - 2;
            MP = int.Parse(row[start..end]);

            var refl = "RELF: ";
            start = row.IndexOf(refl) + refl.Length;
            Reflect = row[start] == '+';

            var cm = "CM: ";
            start = row.IndexOf(cm) + cm.Length;
            CounterMagic = row[start] == '+';

            var ctr = "CTR:";
            start = row.IndexOf(ctr) + ctr.Length;
            end = row.IndexOf(" |", start) - 2;
            ChargeTicks = int.Parse(row[start..end]);

            var calc = "CALC: ";
            start = row.IndexOf(calc) + calc.Length;
            MathMagic = row[start] == '+';

            var cf = "CF: ";
            start = row.IndexOf(cf) + cf.Length;
            CounterFlood = row[start] == '+';

            var jp = "JP:";
            start = row.IndexOf(jp) + jp.Length;
            end = row.IndexOf(" |", start) - 2;
            if (int.TryParse(row[start..end], out var _JP))
            {
                JP = _JP;
            }

            var elem = "ELEM:";
            start = row.IndexOf(elem) + elem.Length;
            end = row.IndexOf(" |", start) - 2;
            Element = row[start..end].Trim();

            var ev = "EV: ";
            start = row.IndexOf(ev) + ev.Length;
            CounterFlood = row[start] == '+';

            var mod = "MOD:";
            start = row.IndexOf(mod) + mod.Length;
            end = row.IndexOf(" |", start) - 2;
            DamageCalc_MOD = row[start..end].Trim();

            var range = "Range:";
            range = range.Trim();
            start = row.IndexOf(range) + range.Length;
            end = row.IndexOf("/", start) - 1;
            end = end >= 0 ? end : row.IndexOf(" |", start) - 2;
            var rangeString = row[start..end].Trim();
            Range_4Directions = rangeString.Contains("4 directions");
            Range_Auto = rangeString.Contains("Auto");
            Range_CasterImmune = rangeString.Contains("CI");
            Range_Linear = rangeString.Contains("linear");
            Range_Weapon = rangeString.Contains("weapon");
            if (!(Range_4Directions || Range_Auto || Range_Linear || Range_Weapon))
            {
                var rSplit = rangeString.Split('v');
                Range_Horizontal = int.Parse(rSplit[0][0] + "");
                Range_Vertical = rSplit.Length == 2 ? (int?)int.Parse(rSplit[1][0] + "") : null;
            }

            var effect = "Effect:";
            start = row.IndexOf(effect) + effect.Length;
            end = row.IndexOf(" /", start) - 2;
            end = end >= 0 ? end : row.IndexOf(" |", start) - 2;
            var effectString = row[start..end].Trim();
            Effect_AllAllies = effectString.Contains("All a");
            Effect_AllEnemies = effectString.Contains("All e");
            Effect_AllyOnly = effectString.Contains("all");
            EffecT_EnemyOnly = effectString.Contains("en");
            Effect_CasterImmune = effectString.Contains("CI");
            Effect_Linear = effectString.Contains("linear");
            if (!(Effect_AllAllies || Effect_AllEnemies))
            {
                var eSplit = effectString.Split('v');
                Effect_Horizontal = int.Parse(eSplit[0][0] + "");
                Range_Vertical = eSplit.Length == 2 ? (int?)int.Parse(eSplit[1][0]+"") : null;
            }
        }

        private void SetFirstRow(string row)
        {
            var start = 0;
            var end = 0;

            void updatePointers(char from, char to)
            {
                start = row.IndexOf(from, end) + 1;
                end = row.IndexOf(to, start);
            }

            updatePointers('[', ']');
            Name = row[start..end];
            updatePointers('[', ']');

            //This doesn't parse right and is annoying
            //var rowNum = "0x" + row.Substring(start, end - start).Trim();
            //BMG_Number = int.Parse(rowNum, System.Globalization.NumberStyles.HexNumber);
            
            var skillGroup = row.Substring(end + 1).Trim();
            Job = skillGroup.ToUpperInvariant() switch
            {
                "WHITE MAGIC" => "Priest",
                "BLACK MAGIC" => "Wizard",
                "TIME MAGIC" => "Time Mage",
                "YIN-YANG MAGIC" => "Oracle",
                "SUMMON MAGIC" => "Summoner",
                "DRAW OUT" => "Samurai",
                "SING" => "Bard",
                "DANCE" => "Dancer",
                "PUNCH ART" => "Monk",
                "STEAL" => "Thief",
                "TALK SKILL" => "Mediator",
                "ELEMENTAL" => "Geomancer",
                "BATTLE SKILL" => "Knight",
                "BASIC SKILL" => "Squire",
                "GUTS" => "Squire",
                _ => throw new NotImplementedException("Parse error")
            };

            if (skillGroup.ToUpper() == "GUTS")
                SpecialConsiderationType = SpecialJobOptions.Guts; 
        }
    }
}
