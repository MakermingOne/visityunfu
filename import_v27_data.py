import re
import json

# 读取当前 JS
with open('assets/index-DRhF-XhE.js', 'r') as f:
    content = f.read()

print("=== 开始安全导入 V27 数据 ===")

# 1. 首先找到所有 food. 字段的结束位置
# 在最后一个美食字段后添加新美食

# V27 的完整美食数据（精简版）
v27_foods = [
    {
        "id": "chaomibing",
        "name": "炒米饼",
        "nameEn": "Fried Rice Cakes",
        "desc": "传统糕点，香脆可口",
        "longDesc": "炒米饼是云浮传统糕点，用糯米炒制后磨粉，加入花生、芝麻、糖等配料压制而成。",
        "location": "云城区、罗定市",
        "image": "/visityunfu/images/food/chaomibing.jpg"
    },
    {
        "id": "guozheng",
        "name": "新兴裹蒸粽",
        "nameEn": "Xinxing Zongzi",
        "desc": "端午佳节，粽香四溢",
        "longDesc": "新兴裹蒸粽是云浮新兴县的传统美食，选用本地糯米、绿豆、猪肉等原料，用冬叶包裹蒸制而成。",
        "location": "新兴县",
        "image": "/visityunfu/images/food/guozheng-zong.jpg"
    },
    {
        "id": "litchi",
        "name": "新兴荔枝",
        "nameEn": "Xinxing Litchi",
        "desc": "岭南佳果，香甜多汁",
        "longDesc": "新兴荔枝是云浮新兴县的特产，果肉晶莹剔透，香甜多汁。",
        "location": "新兴县",
        "image": "/visityunfu/images/food/litchi.jpg"
    }
]

# 构建插入的字符串
food_inserts = []
for food in v27_foods:
    food_str = f',food.{food["id"]}:"{food["name"]}",food.{food["id"]}Desc:"{food["desc"]}",food.{food["id"]}LongDesc:"{food["longDesc"]}",food.{food["id"]}Image:"{food["image"]}",food.{food["id"]}Location:"{food["location"]}"'
    food_inserts.append(food_str)

insert_text = ''.join(food_inserts)

# 找到插入点 - 在 food.wontonDesc 后
marker = 'food.wontonDesc":"皮薄馅大，汤鲜味美"'
pos = content.find(marker)

if pos != -1:
    insert_pos = pos + len(marker)
    new_content = content[:insert_pos] + insert_text + content[insert_pos:]
    
    # 2. 修改 Logo
    # 找到 z1 函数
    func_start = new_content.find('function z1(')
    if func_start != -1:
        # 找到函数结束
        brace_count = 0
        in_string = False
        string_char = None
        func_end = func_start
        
        for i, char in enumerate(new_content[func_start:]):
            if not in_string:
                if char in '"\'`':
                    in_string = True
                    string_char = char
                elif char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0 and i > 100:
                        func_end = func_start + i + 1
                        break
            else:
                if char == string_char and new_content[func_start + i - 1] != '\\':
                    in_string = False
        
        # V27 风格的 Logo
        new_logo = '''function z1({isScrolled:o=!1,size:a="md"}){const{language:l}=In(),r={sm:{container:"h-10",icon:"text-sm",yunfu:"text-lg",wenlv:"text-lg"},md:{container:"h-12",icon:"text-base",yunfu:"text-xl",wenlv:"text-xl"},lg:{container:"h-14",icon:"text-lg",yunfu:"text-2xl",wenlv:"text-2xl"}}[a];return u.jsxs(Ie,{to:"/",className:"flex items-center gap-2 group",children:[u.jsxs("div",{className:`${r.container} aspect-square relative flex items-center justify-center`,children:[u.jsx("div",{className:`absolute inset-0 rounded-full border-2 transition-all duration-300 ${o?"border-amber-600 bg-white":"border-white/90 bg-white/10 backdrop-blur-sm"}`}),u.jsx("span",{className:`relative font-black ${r.icon} tracking-tighter transition-colors ${o?"text-amber-600":"text-white"}`,children:"YF"}),u.jsx("div",{className:`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-colors ${o?"bg-amber-500":"bg-amber-400"}`})]}),u.jsxs("div",{className:"flex flex-col",children:[u.jsxs("div",{className:"flex items-baseline",children:[u.jsx("span",{className:`${r.yunfu} font-bold tracking-wide transition-colors ${o?"text-teal-700":"text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"}`,children:l==="zh"?"云浮":"Visit"}),u.jsx("span",{className:`${r.wenlv} font-bold tracking-wide transition-colors ${o?"text-amber-600":"text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"}`,children:l==="zh"?"文旅":" Yunfu"})]}),u.jsx("span",{className:`text-[10px] tracking-widest uppercase transition-colors ${o?"text-gray-500":"text-white/80"}`,children:l==="zh"?"Visit Yunfu":"Guangdong · China"})]})]})}'''
        
        new_content = new_content[:func_start] + new_logo + new_content[func_end:]
        
        with open('assets/index-DRhF-XhE.js', 'w') as f:
            f.write(new_content)
        
        print("✅ 导入完成:")
        print(f"   - 新增 {len(v27_foods)} 个美食")
        print("   - Logo 更新为 V27 风格")
        print(f"   - 文件大小: {len(new_content)} 字节")
    else:
        print("❌ 未找到 Logo 函数")
else:
    print("❌ 未找到插入点")
