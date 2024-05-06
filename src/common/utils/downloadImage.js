export const downloadBase64Image = (base64String, fileName) => {
  // 将Base64编码的图片数据转换为Blob对象
  let baseArray = base64String.split(",")
  let baseStr = baseArray[0];
  if (baseArray.length > 1) {
    baseStr = baseArray[1];
  }
  const byteCharacters = atob(baseStr);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  // 创建可下载链接
  const url = URL.createObjectURL(blob);

  // 创建隐藏的<a>标签
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // 模拟点击隐藏的<a>标签来触发下载
  link.click();

  // 清理URL对象
  URL.revokeObjectURL(url);
}