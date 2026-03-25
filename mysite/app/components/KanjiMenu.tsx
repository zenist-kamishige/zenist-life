"use client";
import Link from "next/link";

const KANJI_MENU = [
  { kanji: "調", yomi: "ととのえる", desc: "身体・呼吸・食", href: "/shira" },
  { kanji: "解", yomi: "ほどく", desc: "脳・言霊・マインド", href: "/toku" },
  { kanji: "遊", yomi: "あそぶ", desc: "星・魂・瞑想", href: "/asobu" },
  { kanji: "和", yomi: "なごむ", desc: "活動記録", href: "/nagomu" },
];

export default function KanjiMenu() {
  return (
    <section id="kanji-menu" className="kanji-menu">
      <div className="kanji-grid">
        {KANJI_MENU.map((item) => (
          <Link key={item.kanji} href={item.href} className="kanji-btn">
            <span className="kanji-char">{item.kanji}</span>
            <span className="kanji-yomi">{item.yomi}</span>
            <span className="kanji-desc">{item.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
