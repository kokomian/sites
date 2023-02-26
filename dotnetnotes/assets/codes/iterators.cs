using System;
using System.Collections;

namespace Practice1 {
    class Parent :IEnumerable{
        string[] names;
        public Parent(params string[] namesss) {
            names = new String[namesss.Length];
            namesss.CopyTo(names, 0);
        }

        public IEnumerator GetEnumerator() {
            foreach (string name in names)
                yield return name;
        }
    }
    class Program {
        static void Main() {
            Parent p = new Parent("ashok", "satya", "roopai", "ashish");
            IEnumerator itr = p.GetEnumerator();
            while (itr.MoveNext())
                Console.WriteLine(itr.Current);
            foreach (string name in p)
                Console.WriteLine(name);
        }
    }
}
