using System;
using System.IO;
using System.Linq;

namespace FFT_Skill_Parser
{
    class Program
    {
        static void Main(string[] args)
        {
            var path = TryGetSolutionDirectoryInfo().FullName + "\\Skill Files";
            ActiveSkillParser.Parse(path);
            ReactionMovementSupportParser.Parse(path);
        }

        //https://stackoverflow.com/a/35824406
        public static DirectoryInfo TryGetSolutionDirectoryInfo(string currentPath = null)
        {
            var directory = new DirectoryInfo(
                currentPath ?? Directory.GetCurrentDirectory());
            while (directory != null && !directory.GetFiles("README.md").Any())
            {
                directory = directory.Parent;
            }

            return directory;
        }
    }
}
