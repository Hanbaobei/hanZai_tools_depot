import markdown
import asyncio

from pyppeteer import launch
from jinja2 import Template


async def md_to_image(md_content, output_image_path):
    """Markdown 转 图片（保持原有保存文件功能）"""
    rendered_html = await md_to_html(md_content)
    image_bytes = await md_to_card(rendered_html)  # 新增方法调用
    # 保存到本地文件
    with open(output_image_path, "wb") as f:
        f.write(image_bytes)
    return image_bytes


async def md_to_bytes(md_content):
    """Markdown 转 二进制文件
    :param md_content: Markdown 内容
    """
    rendered_html = await md_to_html(md_content)
    image_bytes = await md_to_card(rendered_html)  # 新增方法调用
    return image_bytes


async def md_to_html(
        md_content: str,
        html_template_path: str = r"D:\working\寒寒项目\代码测试\coding\md2card\template.html",
):
    """Markdown 转 HTML
    :param md_content: Markdown 内容
    :param html_template_path: HTML 模板路径
    """
    html_content = markdown.markdown(
        md_content, extensions=["fenced_code", "codehilite"]  # 启用代码高亮
    )
    # 2. 加载模板
    with open(html_template_path, "r", encoding="utf-8") as f:
        template = Template(f.read())
    # 3. 渲染模板
    rendered_html = template.render(content=html_content)
    return rendered_html


async def md_to_card(rendered_html: str):
    """HTML 转 图片"""
    browser = None
    try:
        browser = await launch(
            {
                "executablePath": "C:\Program Files\Google\Chrome\Application\chrome.exe",
                "headless": True,
                "handleSIGINT": False,  # 新增关键参数
                "args": [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                ],
            }
        )
        page = await browser.newPage()
        await page.setContent(rendered_html)

        # 新增等待确保样式加载
        await asyncio.sleep(2)
        await page.waitForSelector(".card")

        await page.setViewport({"width": 800, "height": 600})
        return await page.screenshot(
            {
                "fullPage": True,
                "clip": {
                    "x": 0,
                    "y": 0,
                    "width": 800,
                    "height": await get_content_height(page),
                },
            }
        )

    finally:
        if browser:
            try:
                # 确保所有页面都关闭
                pages = await browser.pages()
                for p in pages:
                    await p.close()
                await browser.close()
            except Exception as e:
                print(f"关闭浏览器时出错: {e}")
        await asyncio.sleep(0.1)  # 添加短暂等待确保浏览器完全关闭


async def get_content_height(page):
    return await page.evaluate(
        """() => {
        const card = document.querySelector('.card');
        if (!card) {
            // 如果没有.card元素，则使用body高度
            return document.body.offsetHeight + 40;
        }
        return card.offsetHeight + 40; // 增加底部间距
    }"""
    )


if __name__ == '__main__':
    md_text = """
    # 豆包知识卡片
    这是一个用 Markdown 制作的 **优雅知识卡片**，支持代码块、图片、列表等格式。
    
    ![示例图片](https://picsum.photos/600/300)
    
    ### 核心特性
    - 自动适应内容长度
    - 支持多主题切换
    - 代码块高亮显示
    - 响应式图片展示
    
    ```python
    
    def hello_world():
        print("Hello, World!")
    
    ```
    """

    # 原有保存文件方式
    asyncio.run(md_to_image(md_text, "output.png"))
