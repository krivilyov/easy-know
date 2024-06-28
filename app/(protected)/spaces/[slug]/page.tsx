export default function Page({ params }: { params: { slug: string } }) {
	return <div>Space SLUG {params.slug}</div>;
}
